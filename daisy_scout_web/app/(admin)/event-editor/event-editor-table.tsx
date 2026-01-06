'use client';

import React from 'react';
import {
  getEventForId,
  getEventTeamList,
  saveManualEvent,
} from '@/app/(admin)/event-editor/event-editor-actions';
import { PageFullProps } from '@/app/ui/types/page-full-props';
import { RowComponent } from 'tabulator-tables';
import dynamic from 'next/dynamic';
import { DaisyButton } from '@/app/ui/DaisyButton';
import { EventTeam } from '@/db/models/event-team';
import { Event } from '@/db/queries/event-queries';

import { Datepicker } from 'flowbite-react';

// Dynamically import the Tabulator component to avoid SSR issues
const DaisyTable = dynamic(() => import('../../ui/daisy-table-component'), {
  ssr: false,
});

export function EventEditorTable({ eventId: event_id }: PageFullProps) {
  const [initialRenderComplete, setInitialRenderComplete] =
    React.useState(false);

  const [teamData, setRawTeamData] = React.useState<EventTeam[]>([]);
  const [eventData, setEventData] = React.useState<Event>();

  // This useEffect will only run once, during the first render
  React.useEffect(() => {
    const getRawEventData = async () => {
      const event = await getEventForId(event_id);
      if (event.length > 0) {
        if (
          event[0].startDate != null &&
          event[0].startDate < new Date(`${event_id.substring(0, 4)}-05-15`)
        ) {
          // cannot edit a downloaded event...
          alert(
            'This season event has already been downloaded. Redirecting to Settings.'
          );
          location.href = '/settings';
          return;
        }
      } else {
        event.push({
          eventCode: event_id.substring(4),
          season: parseInt(event_id.substring(0, 4)),
          eventId: event_id,
          eventName: '',
          startDate: new Date(),
          teams: undefined,
        });
      }
      setEventData(event[0]);

      const teamList = await getEventTeamList(event_id);
      setRawTeamData(teamList);
    };
    getRawEventData();
    // Updating a state causes a re-render
    setInitialRenderComplete(true);
  }, [event_id]);

  const columns = [
    {
      field: 'teamNumber',
      title: 'Team #',
      sorter: 'number',
      width: 100,
      editor: 'input',
      editorParams: {
        mask: '99999',
        elementAttributes: {
          maxlength: '5', //set the maximum character length of the input element to 5 characters
        },
      },
    },
  ];

  function generateTeams() {
    const text =
      'If this is an offseason event, press OK to continue. If this is a regular season event, press cancel and pull the event from the Settings page.';
    if (confirm(text) == false) {
      return;
    }

    const numMatches = parseInt(
      (document.getElementById('num-teams') as HTMLInputElement).value
    );
    const newMatchData = teamData.slice();
    for (let i = teamData.length + 1; i <= numMatches; i++) {
      newMatchData.push({
        eventId: event_id,
        teamNumber: null,
      });
    }
    setRawTeamData(newMatchData);
  }

  function saveEvent() {
    const text = 'Are you sure you want to save this event?';
    if (confirm(text) == false) {
      return;
    }

    if (eventData == null) {
      alert('Event not found.');
      return;
    }
    if (eventData.eventName === '') {
      alert('Event name is required.');
      return;
    }
    if (eventData.startDate == null) {
      alert('Event start date is required.');
      return;
    }

    if (teamData.length < 1) {
      alert('Event team list is empty.');
      return;
    }

    saveManualEvent(eventData, teamData);

    alert('Event saved.');
    location.href = '#';
  }

  function deleteEventTeams() {
    const text = 'Press OK to clear the team list, or cancel to leave as is.';
    if (confirm(text) == true) {
      setRawTeamData([]);
    }
  }

  // initialRenderComplete will be false on the first render and true on all following renders
  if (!initialRenderComplete) {
    // Returning null will prevent the component from rendering, so the content will simply be missing from
    // the server HTML and also wont render during the first client-side render.
    return null;
  } else {
    return (
      <div>
        <main>
          <div id="generate-controls">
            <input id="num-teams" type="text" placeholder="# Teams" />
            {'  '}
            <DaisyButton id="gen-matches" onClick={generateTeams}>
              Generate
              <br />
              Team Records
            </DaisyButton>
            {'  '}
            <DaisyButton id="del-schedule" onClick={deleteEventTeams}>
              Delete Generated
              <br />
              Schedule
            </DaisyButton>
            {'  '}
          </div>
          <br />

          <input
            id="event-code"
            type="text"
            value={eventData?.eventId.substring(4) || ''}
            readOnly={true}
          />
          <input
            id="season"
            type="text"
            value={eventData?.eventId.substring(0, 4) || ''}
            readOnly={true}
          />

          <input
            id="event-name"
            name="event-name"
            maxLength={150}
            type="text"
            defaultValue={eventData?.eventName || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (eventData) {
                setEventData({ ...eventData, eventName: e.target.value });
              }
            }}
          />

          <Datepicker
            id="start-date"
            name="start-date"
            defaultValue={eventData?.startDate || undefined}
            onChange={(date: Date | null) => {
              if (eventData && date) {
                setEventData({ ...eventData, startDate: date });
              }
            }}
          />

          <h2>Offseason Event Editor</h2>
          <DaisyTable
            data={teamData}
            columns={columns}
            layout={'fitData'}
            rowFormatter={(row: RowComponent) => {
              row.getElement().style.textAlign = 'right';
            }}
          />
          <br />
          <div>
            <DaisyButton id="save-schedule" onClick={saveEvent}>
              Save Event
            </DaisyButton>
          </div>
          <br />
          <br />
        </main>
      </div>
    );
  }
}
