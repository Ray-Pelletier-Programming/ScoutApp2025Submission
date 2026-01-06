'use server';
import jsdom from 'jsdom';
import { FrcLocksData } from './frc-locks-data';

export async function GetDcmpPredictedTeams(): Promise<string> {
  const districtTeams: Array<FrcLocksData> = [];

  // call FRCLocks site for FMA
  const response = await fetch(`https://frclocks.com/districts/fma.html`, {
    method: 'GET',
  });

  // get the entire web page
  const frcLocksWebpage = await response.text();

  // load the webpage as HTML/XML
  const frcLocksPageDom = new jsdom.JSDOM(frcLocksWebpage);

  // get the rankings table's array of rows for DCMP
  const rankingTableRows =
    frcLocksPageDom.window.document.querySelectorAll('.rankings-table tr');

  // if the list of rows has any rows
  if (rankingTableRows) {
    // loop through the rows one by one in table order
    for (let index = 0; index < rankingTableRows.length; index++) {
      // get the row from the list
      const rankingRow = rankingTableRows[index];

      // get the team number (without the frc prefix) from the row as a number
      const teamNumber = parseInt(
        rankingRow
          .querySelector('.col-team a')
          ?.textContent?.replace('frc', '') ?? ''
      );

      // get the locked value from the row as a string could be in the form
      // 100%   : DCMP Qualified
      // 99.9%  : 0.1% - mathematically in range
      // Impact : auto qualifier
      // 0%     : out of range, but Award could allow them to qualify
      // -      : Eliminated
      const lockedStatusString =
        rankingRow.querySelector('.col-locked a')?.innerHTML ??
        rankingRow.querySelector('.col-locked')?.textContent;

      // The teams total points to date as a number
      const totalPoints = parseInt(
        rankingRow.querySelector('.col-total')?.textContent ?? ''
      );

      // if the team number exists (for some reason first row is all undefined)
      // then add to the possibility of a district team
      if (teamNumber) {
        districtTeams.push({
          teamNumber: teamNumber,
          lockedStatus: lockedStatusString ?? '',
          lockedVal:
            lockedStatusString == null
              ? 1
              : lockedStatusString == 'Impact'
                ? 1
                : lockedStatusString == '-'
                  ? -1
                  : Number(
                      (
                        parseFloat(lockedStatusString.replace('%', '')) / 100.0
                      ).toFixed(3)
                    ),
          primarySort: lockedStatusString == 'Impact' ? 1 : 0,
          totalDcmpPoints: totalPoints,
        });
      }
    }
  }

  // remove mathematically eliminated and out of range teams from frclocks table
  const qualifyingTeams = districtTeams.filter(
    ({ lockedStatus: lockedFilter }) =>
      lockedFilter != '-' && lockedFilter != '0%'
  );

  //console.log(JSON.stringify(qualifyingTeams));

  // return set of possible DCMP teams
  return JSON.stringify(qualifyingTeams);
}
