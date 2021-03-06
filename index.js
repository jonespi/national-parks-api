const usStates = [
    { name: 'ALABAMA', abbreviation: 'AL'},
    { name: 'ALASKA', abbreviation: 'AK'},
    { name: 'AMERICAN SAMOA', abbreviation: 'AS'},
    { name: 'ARIZONA', abbreviation: 'AZ'},
    { name: 'ARKANSAS', abbreviation: 'AR'},
    { name: 'CALIFORNIA', abbreviation: 'CA'},
    { name: 'COLORADO', abbreviation: 'CO'},
    { name: 'CONNECTICUT', abbreviation: 'CT'},
    { name: 'DELAWARE', abbreviation: 'DE'},
    { name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC'},
    { name: 'FEDERATED STATES OF MICRONESIA', abbreviation: 'FM'},
    { name: 'FLORIDA', abbreviation: 'FL'},
    { name: 'GEORGIA', abbreviation: 'GA'},
    { name: 'GUAM', abbreviation: 'GU'},
    { name: 'HAWAII', abbreviation: 'HI'},
    { name: 'IDAHO', abbreviation: 'ID'},
    { name: 'ILLINOIS', abbreviation: 'IL'},
    { name: 'INDIANA', abbreviation: 'IN'},
    { name: 'IOWA', abbreviation: 'IA'},
    { name: 'KANSAS', abbreviation: 'KS'},
    { name: 'KENTUCKY', abbreviation: 'KY'},
    { name: 'LOUISIANA', abbreviation: 'LA'},
    { name: 'MAINE', abbreviation: 'ME'},
    { name: 'MARSHALL ISLANDS', abbreviation: 'MH'},
    { name: 'MARYLAND', abbreviation: 'MD'},
    { name: 'MASSACHUSETTS', abbreviation: 'MA'},
    { name: 'MICHIGAN', abbreviation: 'MI'},
    { name: 'MINNESOTA', abbreviation: 'MN'},
    { name: 'MISSISSIPPI', abbreviation: 'MS'},
    { name: 'MISSOURI', abbreviation: 'MO'},
    { name: 'MONTANA', abbreviation: 'MT'},
    { name: 'NEBRASKA', abbreviation: 'NE'},
    { name: 'NEVADA', abbreviation: 'NV'},
    { name: 'NEW HAMPSHIRE', abbreviation: 'NH'},
    { name: 'NEW JERSEY', abbreviation: 'NJ'},
    { name: 'NEW MEXICO', abbreviation: 'NM'},
    { name: 'NEW YORK', abbreviation: 'NY'},
    { name: 'NORTH CAROLINA', abbreviation: 'NC'},
    { name: 'NORTH DAKOTA', abbreviation: 'ND'},
    { name: 'NORTHERN MARIANA ISLANDS', abbreviation: 'MP'},
    { name: 'OHIO', abbreviation: 'OH'},
    { name: 'OKLAHOMA', abbreviation: 'OK'},
    { name: 'OREGON', abbreviation: 'OR'},
    { name: 'PALAU', abbreviation: 'PW'},
    { name: 'PENNSYLVANIA', abbreviation: 'PA'},
    { name: 'PUERTO RICO', abbreviation: 'PR'},
    { name: 'RHODE ISLAND', abbreviation: 'RI'},
    { name: 'SOUTH CAROLINA', abbreviation: 'SC'},
    { name: 'SOUTH DAKOTA', abbreviation: 'SD'},
    { name: 'TENNESSEE', abbreviation: 'TN'},
    { name: 'TEXAS', abbreviation: 'TX'},
    { name: 'UTAH', abbreviation: 'UT'},
    { name: 'VERMONT', abbreviation: 'VT'},
    { name: 'VIRGIN ISLANDS', abbreviation: 'VI'},
    { name: 'VIRGINIA', abbreviation: 'VA'},
    { name: 'WASHINGTON', abbreviation: 'WA'},
    { name: 'WEST VIRGINIA', abbreviation: 'WV'},
    { name: 'WISCONSIN', abbreviation: 'WI'},
    { name: 'WYOMING', abbreviation: 'WY' }
];

function createStateSelector() { 
  for (let i = 0; i<usStates.length; i++) {
    $('#state').append(`<input type='checkbox' value=${usStates[i].abbreviation}>${usStates[i].name}<br>`)
  }
}

const KEY = 'amqdM5ituE2fRYkxV5NN9Mhll8kzRlq8EDBtrSuj';
const searchURL = 'https://api.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function mergeCheckedStates() {
  let checkedStates = [];
    $(':checkbox:checked').each(function(i) {
        checkedStates[i] = $(this).val();
    });
    state = checkedStates.join(',');  
}

function displayResults(responseJson, maxResults) {
  $('#results-list').empty();
  if (maxResults > responseJson.data.length) {
    maxResults = responseJson.data.length;
  }
  for (let i = 0; i < maxResults; i++){
    $('#results-list').append(
      `<li>
          <a href='${responseJson.data[i].url}'>
              <h3>${responseJson.data[i].name}</h3>
          </a>
          <p>${responseJson.data[i].description}</p>
          <a href='${responseJson.data[i].url}'>
              <p>${responseJson.data[i].url}</p>
          </a>
      </li>`
    );
    $('#results').removeClass('hidden');
  }
}

function getParks(query, maxResults=10, state) {
    const params = {
      key: KEY,
      q: query,
      stateCode: state
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;
  
    fetch(url)
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if ((responseJson.data).length !== 0) {
          displayResults(responseJson, maxResults);
          $('#js-error-message').empty();
        } else {
          generateErrorMessage(query);
          console.log('error message');
        }
      })
      .catch(err => {
        generateErrorMessage(err);
      });
}

function generateErrorMessage(query) {
  $('#js-error-message').text(`Something went wrong: no results for ${query}`);
  $('#results-list').empty();
}

function searchButtonPress() {
  $('form').on('click', '#search-button', event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    mergeCheckedStates();
    console.log(state);
    getParks(searchTerm, maxResults, state);
  });
}

function runApp() {
  searchButtonPress();
  createStateSelector();
}

$(runApp);
