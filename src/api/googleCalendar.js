// Google Calendar API
import ApiCalendar from 'react-google-calendar-api';

const config = {
  "clientId": "1076991918940-nfgjkcmen5rocbd5p87ai8um6okbss20.apps.googleusercontent.com",
  "apiKey": "AIzaSyAdsFECf-w0-CGJG3U7rKRkEWYUfTQ-Q0w",
  "scope": "https://www.googleapis.com/auth/calendar",
  "discoveryDocs": [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
  ]
}

export const apiCalendar = new ApiCalendar(config)
// End Of Google Calendar API