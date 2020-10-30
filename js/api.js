var league_id = 2015;
var token = '16d85bf702974259b17e4dff4faeade4';
var base_url = "https://api.football-data.org/v2/";
var standing_url = `${base_url}competitions/${league_id}/standings`;
var team_url = `${base_url}teams/`;

var fetchApi = url => {
  return fetch(url, 
    { 
     mode: 'cors',
     headers: {'X-Auth-Token': token }
    });
}

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

// Blok kode untuk melakukan request data json
function getStandings() {
    if ("caches" in window) {
      caches.match(standing_url).then(function(response) {
        if (response) {
          response.json().then(function(data) {
          
        var standingsHTML =  `
        <div class="card" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;">
                <table style="font-size:14px;" class="responsive-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Logo</th>
                      <th>CLUB</th>
                      <th>PG</th>
                      <th>W</th>
                      <th>D</th>
                      <th>L</th>
                      <th>GF</th>
                      <th>GA</th>
                      <th>GD</th>
                      <th>Pts</th>
                      <th>DT</th>
                    </tr>
                  </thead>
                  <tbody>
            `;
          data.standings["0"].table.forEach(function(item) {
            standingsHTML += `
                    <tr>
                      <td>${item.position}</td>
                      <td><img style="width:20px;" src="${item.team.crestUrl.replace(/^http:\/\//i, 'https://')}"></td>
                      <td>${item.team.name}</td>
                      <td>${item.playedGames}</td>
                      <td>${item.won}</td>
                      <td>${item.draw}</td>
                      <td>${item.lost}</td>
                      <td>${item.goalsFor}</td>
                      <td>${item.goalsAgainst}</td>
                      <td>${item.goalDifference}</td>
                      <td>${item.points}</td>
                      <td><a href="./team.html?id=${item.team.id}">Detail</a></td>
                    </tr>
            `;
            })
            
            standingsHTML += `</tbody>
                    </table>`;
            document.getElementById("standings").innerHTML = standingsHTML;
          });
        }
      });
    }

    fetchApi(standing_url)
      .then(status)
      .then(json)
      .then(function(data) {
        console.log(data);
      
        var standingsHTML =  `
        <div class="card" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;">
                <table style="font-size:14px;" class="striped" class="responsive-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Logo</th>
                      <th>CLUB</th>
                      <th>PG</th>
                      <th>W</th>
                      <th>D</th>
                      <th>L</th>
                      <th>GF</th>
                      <th>GA</th>
                      <th>GD</th>
                      <th>Pts</th>
                      <th>DT</th>
                    </tr>
                  </thead>
                  <tbody>
            `;
          data.standings["0"].table.forEach(function(item) {
            standingsHTML += `
                    <tr>
                      <td>${item.position}</td>
                      <td><img style="width:20px;" src="${item.team.crestUrl.replace(/^http:\/\//i, 'https://')}"></td>
                      <td>${item.team.name}</td>
                      <td>${item.playedGames}</td>
                      <td>${item.won}</td>
                      <td>${item.draw}</td>
                      <td>${item.lost}</td>
                      <td>${item.goalsFor}</td>
                      <td>${item.goalsAgainst}</td>
                      <td>${item.goalDifference}</td>
                      <td>${item.points}</td>
                      <td><a href="./team.html?id=${item.team.id}">Detail</a></td>
                    </tr>
            `;
        });
        standingsHTML += `</tbody>
                </table> </div>`
                
            ;
        document.getElementById("standings").innerHTML = standingsHTML;
      })
      .catch(error);
}

function getTeamById() {
  
  return new Promise(function(resolve) {
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");
    var team_id_url = `${base_url}teams/${idParam}`;
    if ("caches" in window) {
      caches.match(team_id_url).then(function(response) {
        if (response) {
          response.json().then(function(data) {
            var teamHTML = `
            <div class="row">
            <div class="col s12 m12">
              <div class="card">
                <div class="card-image">
                  <img src="${data.crestUrl.replace(/^http:\/\//i, 'https://')}">
                </div>
                <div class="card-content">
               <h1 ${data.name}></h1>
                  <p> ${data.shortName}  is short name from ${data.name} </p>
                </div>
              </div>
            </div>
          </div> `;
            document.getElementById("body-content").innerHTML = teamHTML;
            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
          });
        }
      });
    }

    fetchApi(team_id_url)
      .then(status)
      .then(json)
      .then(function(data) {
        // Objek/array JavaScript dari response.json() masuk lewat data.
        console.log(data);
        // tampilkan data detail team
        var teamHTML = `
        <div class="row">
        <div class="col s12 m12">
          <div class="card">
            <div class="card-image">
              <img src="${data.crestUrl.replace(/^http:\/\//i, 'https://')}">
              <span class="card-title">Information Club</span>
            </div>
            <div class="card-content">
           <h1 ${data.name}></h1>
           <p> ${data.shortName}  is short name from ${data.name}</p>
            </div>
          </div>
        </div>
      </div>`;
        document.getElementById("body-content").innerHTML = teamHTML;
        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
        resolve(data);
      });
    }
)}

function getSavedTeams() {
  getAll().then(function(data) {
    console.log(data);
    // Menyusun komponen card artikel secara dinamis
    var teamsHTML = "";
    data.forEach(function(data) {
      teamsHTML += `
      <div class="row">
      <div class="col s12 m12">
        <div class="card">
          <div class="card-image">
            <img src="${data.crestUrl.replace(/^http:\/\//i, 'https://')}">
            <span class="card-title">Information Club</span>
          </div>
          <div class="card-content">
         <h1 ${data.name}></h1>
         <p> ${data.shortName} is short name from ${data.name}</p>
          </div>
        
        </div>
          <button class="btn-floating red" id="delete" value="${data.id}">
          <i class="material-icons">delete</i>
          </button>
      </div>
    </div>
  `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #body-content
    document.getElementById("body-content").innerHTML = teamsHTML;

    let btn = document.querySelectorAll(".btn-floating");
    for(let button of btn) {
        button.addEventListener("click", function () {
            let id = Number(button.value);
            console.log(id);
            dbDeleteTeam(id).then(() => {
                getSavedTeams()
            })
        }
        )
    }

  });
}


