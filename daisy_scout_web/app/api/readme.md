# API Schema Definitions

## Location of API

`/api` - the root of the API under the website, displays a json response with a welcome message.

## `Seasons`

Allows requestors to learn about the supported seasons, details of a single season, as well as the events for the season.

### Get Supported Seasons

Returns the listing of seasons the scouting app supports

- HTTP Method: GET
- Endpoint: `/api/seasons`

### Get Season Details

Gets the details of the requested season (year). Currently, the only season information this api returns would be the name of the season.

- HTTP Method: GET
- Endpoint: `/api/seasons/{:season}`

### Get Events scheduled for a season

Returns the listing of events for the supplied season.

- HTTP Method: GET
- Endpoint: `/api/seasons/{:season}/events`

  Note: to get further details of season events, use the `Events` endpoints

## `Events`

Allows requestors to learn about an event of a given season.

## Get All Events

    Note: you cannot request all events, or all events for a season from this location. Instead use the `/api/seasons/{:season}/events` endpoint.

### Get Event Details

Gets the details of the requested event (for a season).

- HTTP Method: GET
- Endpoint: `/api/events/{:eventId}`

### Get Match Schedule for an event

Gets the complete match schedule for the event.

- HTTP Method: GET
- Endpoint: `/api/events/{:eventId}/match-schedule`

### Get All Collected Match Data for an event

Gets the complete match data for the event.

- HTTP Method: GET
- Endpoint: `/api/events/{:eventId}/match-data`

### Get All Collected Leader/Subjective Data for an event

Gets the complete leader/subjective data for the event.

- HTTP Method: GET
- Endpoint: `/api/events/{:eventId}/leader-data`

### Get All Collected pit Data for an event

Gets the complete pit data for the event.

- HTTP Method: GET
- Endpoint: `/api/events/{:eventId}/pit-data`

## `Match-Schedule`

Allows requestors to learn about a given match of an event

### Get Match Details

Gets the details of the requested match (for an event).

- HTTP Method: GET
- Endpoint: `/api/match-schedule/{:eventMatchId}`

### Get Teams for a Match

Gets the teams for the requested match (for an event).

- HTTP Method: GET
- Endpoint: `/api/match-schedule/{:eventMatchId}/teams`

**To be built still:**

- get leader data for match - `/api/match-schedule/{:eventMatchId}/leader-data`
- get match data for match - `/api/match-schedule/{:eventMatchId}/match-data`
- get pit data for match - `/api/match-schedule/{:eventMatchId}/pit-data`

## `Leader-Data`

Allows requestors to learn about leader/subjective data for an event.

## Get All Leader-Data

    Note: you cannot request all leader/subjective data, or all leader/subjective data for an event from this location. Instead use the `/api/events/{:eventId}/leader-data` endpoint.

## Get all Leader-Data for a match

    Note: you cannot request all leader/subjective for a match from this location. Instead use the `/api/match-schedule/{:eventMatchId}/leader-data` endpoint.

## Add leader-data (for a match)

Adds a record to the leader data table in the database.

- HTTP Method: POST
- Endpoint: `/api/leader-data`
- Content-type: `application/json`

## `Match-Data`

Allows requestors to learn about match data for an event.

## Get All Match-Data

    Note: you cannot request all match data, or all match data for an event from this location. Instead use the `/api/events/{:eventId}/match-data` endpoint.

## Get all Match-Data for a match

    Note: you cannot request all match data for a match from this location. Instead use the `/api/match-schedule/{:eventMatchId}/match-data` endpoint.

## Add match-data (for a match)

Adds a record to the match data table in the database.

- HTTP Method: POST
- Endpoint: `/api/match-data`
- Content-type: `application/json`

## `Pit-Data`

Allows requestors to learn about pit data for an event.

## Get All Pit-Data

    Note: you cannot request all pit data, or all pit data for an event from this location. Instead use the `/api/events/{:eventId}/pit-data` endpoint.

To be built

## Get all Pit-Data

    Note: you cannot request all pit data for a match because pit data is independent of matches

## Add pit-data (for an event)

Adds a record to the pit data table in the database.

- HTTP Method: POST
- Endpoint: `/api/pit-data`
- Content-type: `application/json`
