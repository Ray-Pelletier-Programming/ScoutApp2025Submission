import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from 'flowbite-react';
import { ActiveCompBanner } from '../active-comp-banner';
import { isPublicCloud } from '@/util/envHelper';
import { headers } from 'next/headers';

export async function DaisyScoutNavBar() {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname');
  console.log('path', pathname);
  console.log(
    'predict',
    (pathname?.toLowerCase() === '/match-predictor').toString()
  );
  return (
    <Navbar fluid className="bg-daisy-primary-darkblue">
      <NavbarBrand href="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold text-white">
          Daisy Scouting
        </span>
      </NavbarBrand>
      <div className="flex text-white" suppressHydrationWarning></div>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={<Avatar alt="User settings" img="/daisy.png" rounded />}
        >
          <DropdownHeader>
            <span className="block truncate text-sm font-medium">
              Team 341 Scouting
            </span>
            <ActiveCompBanner />
          </DropdownHeader>
          {!isPublicCloud && (
            <>
              <DropdownItem as="a" href="/raw-data">
                Raw Data
              </DropdownItem>
              <DropdownItem
                as="a"
                href="http://localhost:8090/"
                target="_blank"
              >
                Scanner
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem
                as="a"
                href="http://localhost:5050/"
                target="_blank"
              >
                Database
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem as="a" href="/dcmp-prescout">
                DCMP Prescouting
              </DropdownItem>
              <DropdownItem as="a" href="/cmp-prescout">
                Event Prescouting
              </DropdownItem>
              <DropdownItem as="a" href="/event-editor">
                Offseason Event Editor
              </DropdownItem>{' '}
              <DropdownItem as="a" href="/event-schedule-editor">
                Offseason Match Schedule Editor
              </DropdownItem>
              <DropdownDivider />
            </>
          )}
          <DropdownItem as="a" href="/db-stats">
            DB Stats
          </DropdownItem>
          <DropdownItem as="a" href="/settings">
            Settings
          </DropdownItem>
          {/*
          <DropdownDivider />
          <DropdownItem disabled={true}>Sign out</DropdownItem>
          */}
        </Dropdown>
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink
          href="/event-schedule/"
          className={
            pathname?.toLowerCase() === '/event-schedule'
              ? 'text-white daisy-active-nav !important'
              : 'text-white'
          }
          //active={pathname?.toLowerCase() === '/event-schedule'}
        >
          Match Schedule
        </NavbarLink>
        <NavbarLink
          href="/team-stats/"
          className={
            pathname?.toLowerCase() === '/team-stats'
              ? 'text-white daisy-active-nav !important'
              : 'text-white'
          }
          //active={pathname?.toLowerCase() === '/team-stats'}
        >
          Team Statistics
        </NavbarLink>
        <NavbarLink
          href="/event-stats/"
          className={
            pathname?.toLowerCase() === '/event-stats'
              ? 'text-white daisy-active-nav !important'
              : 'text-white'
          }
          //active={pathname?.toLowerCase() === '/event-stats'}
        >
          Event Statistics
        </NavbarLink>
        <NavbarLink
          href="/match-predictor/"
          className={
            pathname?.toLowerCase() === '/match-predictor'
              ? 'text-white daisy-active-nav !important'
              : 'text-white'
          }
          //active={pathname?.toLowerCase() === '/match-predictor'}
        >
          Match Predictor
        </NavbarLink>
        {!isPublicCloud && (
          <NavbarLink
            href="/pick-list/"
            className={
              pathname?.toLowerCase() === '/pick-list'
                ? 'text-white daisy-active-nav !important'
                : 'text-white'
            }
            //active={pathname?.toLowerCase() === '/pick-list'}
          >
            Picklist
          </NavbarLink>
        )}
        {!isPublicCloud && (
          <NavbarLink
            href="/casino/"
            className={
              pathname?.toLowerCase() === '/casino'
                ? 'text-white daisy-active-nav !important'
                : 'text-white'
            }
            //active={pathname?.toLowerCase() === '/casino'}
          >
            Casino
          </NavbarLink>
        )}
      </NavbarCollapse>
    </Navbar>
  );
}
