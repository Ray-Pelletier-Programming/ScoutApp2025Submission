import React from 'react';
import { TeamDataProps } from '../../../ui/types/team-data-props';
import { getTeam2025PitDataForEvent } from '../team-stats-actions';
import { Pit2025Data } from '@/db/models/pit-2025-data';

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
export function PitData2025({ season, eventId, teamNumber }: TeamDataProps) {
  const [initialRenderComplete, setInitialRenderComplete] =
    React.useState(false);

  const [teamPitData, setRawTeamPitData] = React.useState<
    Pit2025Data | undefined
  >();

  // This useEffect will only run once, during the first render
  React.useEffect(() => {
    const getRawMatchData = async () => {
      if (teamNumber != null && teamNumber != '') {
        const data = await getTeam2025PitDataForEvent(eventId, teamNumber);
        setRawTeamPitData(data);
      } else {
        setRawTeamPitData(undefined);
      }
    };
    getRawMatchData();
    // Updating a state causes a re-render
    setInitialRenderComplete(true);
  }, [eventId, teamNumber]);

  // initialRenderComplete will be false on the first render and true on all following renders
  if (!initialRenderComplete) {
    // Returning null will prevent the component from rendering, so the content will simply be missing from
    // the server HTML and also wont render during the first client-side render.
    return null;
  } else {
    return (
      <div>
        <center>
          <table>
            <tbody>
              <tr>
                <td>
                  <table>
                    <tbody>
                      <tr>
                        <td colSpan={2}>
                          <b>General Robot</b>
                        </td>
                      </tr>
                      <tr>
                        <td width={300}>Drive Train</td>
                        <td>{teamPitData?.driveTrain}</td>
                      </tr>
                      <tr>
                        <td>Robot Width</td>
                        <td>{teamPitData?.robotWidth}</td>
                      </tr>
                      <tr>
                        <td>Robot Length</td>
                        <td>{teamPitData?.robotLength}</td>
                      </tr>
                      <tr>
                        <td>Intake Ground (Algae / Coral)</td>
                        <td>
                          {teamPitData?.intakeGroundAlgae?.toString() ?? ''} /{' '}
                          {teamPitData?.intakeGroundCoral?.toString() ?? ''}
                        </td>
                      </tr>
                      <tr>
                        <td>Intake Reef (Algae / Coral)</td>
                        <td>
                          {teamPitData?.intakeReefAlgae?.toString() ?? ''} /{' '}
                          {teamPitData?.intakeGroundCoral?.toString() ?? ''}
                        </td>
                      </tr>
                      <tr>
                        <td>Score Teleop L1</td>
                        <td>{teamPitData?.scoreTeleopL1?.toString() ?? ''}</td>
                      </tr>
                      <tr>
                        <td>Score Teleop L2</td>
                        <td>{teamPitData?.scoreTeleopL2?.toString() ?? ''}</td>
                      </tr>
                      <tr>
                        <td>Score Teleop L3</td>
                        <td>{teamPitData?.scoreTeleopL3?.toString() ?? ''}</td>
                      </tr>
                      <tr>
                        <td>Score Teleop L4</td>
                        <td>{teamPitData?.scoreTeleopL4?.toString() ?? ''}</td>
                      </tr>
                      <tr>
                        <td>Score Teleop Net</td>
                        <td>{teamPitData?.scoreTeleopNet?.toString() ?? ''}</td>
                      </tr>
                      <tr>
                        <td>Score Teleop Processor</td>
                        <td>
                          {teamPitData?.scoreTeleopProcessor?.toString() ?? ''}
                        </td>
                      </tr>
                      <tr>
                        <td>Can Climb (Shallow / Deep / None)</td>
                        <td>
                          {teamPitData?.canShallowClimb?.toString() ?? ''} /{' '}
                          {teamPitData?.canDeepClimb?.toString() ?? ''} /{' '}
                          {teamPitData?.noClimb?.toString() ?? ''}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td width="150px"></td>
                <td>
                  <table>
                    <tbody>
                      <tr>
                        <td colSpan={2}>
                          <b>Autonomous</b>
                        </td>
                      </tr>
                      <tr>
                        <td width={300}>Start Alliance Barge</td>
                        <td>
                          {teamPitData?.prefStartAllyHP?.toString() ?? ''}
                        </td>
                      </tr>
                      <tr>
                        <td>Start Center</td>
                        <td>
                          {teamPitData?.prefStartCenter?.toString() ?? ''}
                        </td>
                      </tr>
                      <tr>
                        <td>Start Opponent Barge</td>
                        <td>{teamPitData?.prefStartOppHP?.toString() ?? ''}</td>
                      </tr>
                      <tr>
                        <td>No Start Preference</td>
                        <td>{teamPitData?.prefStartNone?.toString() ?? ''}</td>
                      </tr>
                      <tr>
                        <td>Score Auto L1</td>
                        <td>{teamPitData?.scoreAutoL1?.toString() ?? ''}</td>
                      </tr>
                      <tr>
                        <td>Score Auto (L2)</td>
                        <td>{teamPitData?.scoreAutoL2?.toString() ?? ''}</td>
                      </tr>
                      <tr>
                        <td>Score Auto (L3)</td>
                        <td>{teamPitData?.scoreAutoL3?.toString() ?? ''}</td>
                      </tr>
                      <tr>
                        <td>Score Auto (L4)</td>
                        <td>{teamPitData?.scoreAutoL4?.toString() ?? ''}</td>
                      </tr>
                      <tr>
                        <td>Score Auto Net</td>
                        <td>{teamPitData?.scoreAutoNet?.toString() ?? ''}</td>
                      </tr>
                      <tr>
                        <td>Score Auto Processor</td>
                        <td>
                          {teamPitData?.scoreAutoProcessor?.toString() ?? ''}
                        </td>
                      </tr>
                      <tr>
                        <td>Auto Intake HP Coral</td>
                        <td>
                          {teamPitData?.autoIntakeHPCoral?.toString() ?? ''}
                        </td>
                      </tr>
                      <tr>
                        <td>Auto Intake Ground Coral</td>
                        <td>
                          {teamPitData?.autoIntakeGroundCoral?.toString() ?? ''}
                        </td>
                      </tr>
                      <tr>
                        <td>Max Auto Game Pieces Scored</td>
                        <td>
                          {teamPitData?.autoMaxGamePieces?.toString() ?? ''}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td colSpan={3}>
                  <br />
                  <br />
                  <table>
                    <tbody>
                      <tr>
                        <td width="180px">
                          <strong>HP Player Location:</strong>
                        </td>
                        <td>{teamPitData?.humanPlayerLoc}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Notable Features:</strong>
                        </td>
                        <td>{teamPitData?.notableFeatures}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </center>

        <br />
        {
          //teamPitData ? JSON.stringify(teamPitData) : 'No data available'
        }
      </div>
    );
  }
}
