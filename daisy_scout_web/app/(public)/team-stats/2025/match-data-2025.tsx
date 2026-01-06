import React from 'react';
import { TeamDataProps } from '../../../ui/types/team-data-props';
import { getTeam2025MatchDataForEvent } from '../team-stats-actions';
import { TeamMatch2025Data } from '@/db/models/team-match-2025-data';
import { DriverRating2025 } from './driver-rating-chart';
import { Endgame2025 } from './endgame-chart';
import { Role2025 } from './role-chart';
import { Operability2025 } from './operability-chart';
import { TotalPiecesScored2025 } from './coral-pieces-scored-chart';
import { CoralPiecesScored2025 } from './total-pieces-scored-chart copy';
import { Leave2025 } from './leave-chart';
import { AutoStartLocation2025 } from './auto-start-location-chart';
import { AlgaePiecesRemoved } from './algae-pieces-removed-chart';
import { matchTypes } from '@/app/ui/constants/match-type';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
export function MatchData2025({ season, eventId, teamNumber }: TeamDataProps) {
  const [initialRenderComplete, setInitialRenderComplete] =
    React.useState(false);

  const [teamMatchData, setRawTeamMatchData] = React.useState<
    TeamMatch2025Data[] | undefined
  >();

  // This useEffect will only run once, during the first render
  React.useEffect(() => {
    const getRawMatchData = async () => {
      if (teamNumber != null && teamNumber != '') {
        const data = await getTeam2025MatchDataForEvent(
          eventId,
          teamNumber,
          matchTypes.qual
        );
        setRawTeamMatchData(data);
      } else {
        setRawTeamMatchData(undefined);
      }
    };
    getRawMatchData();
    // Updating a state causes a re-render
    setInitialRenderComplete(true);
  }, [eventId, teamNumber]);

  // Render the content on the page based on the current season
  // to change the display for a season, go to the correct imported
  // component for the season.
  const renderDriverRatings = () => {
    if (teamMatchData && teamMatchData.length > 0) {
      return (
        <div>
          <table>
            <tbody>
              <tr>
                <td width={400} valign="top">
                  <TotalPiecesScored2025 data={teamMatchData} />
                </td>
                <td width={50}></td>
                <td width={400} valign="top">
                  <CoralPiecesScored2025 data={teamMatchData} />
                </td>
                <td width={50}></td>
                <td width={400} valign="top">
                  <AlgaePiecesRemoved data={teamMatchData} />
                </td>
              </tr>
              <tr>
                <td valign="top">
                  <Leave2025 data={teamMatchData} />
                </td>
                <td></td>
                <td valign="top">
                  <AutoStartLocation2025 data={teamMatchData} />
                </td>
                <td></td>
                <td valign="top">
                  <Operability2025 data={teamMatchData} />
                </td>
              </tr>
              <tr>
                <td valign="top">
                  <Role2025 data={teamMatchData} />
                </td>
                <td></td>
                <td valign="top">
                  <DriverRating2025 data={teamMatchData} />
                </td>
                <td></td>
                <td valign="top">
                  <Endgame2025 data={teamMatchData} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    } else {
      return;
    }
  };

  // initialRenderComplete will be false on the first render and true on all following renders
  if (!initialRenderComplete) {
    // Returning null will prevent the component from rendering, so the content will simply be missing from
    // the server HTML and also wont render during the first client-side render.
    return null;
  } else {
    return (
      <div>
        {renderDriverRatings()}

        {
          //teamMatchData ? JSON.stringify(teamMatchData) : 'No data available'
        }
      </div>
    );
  }
}
