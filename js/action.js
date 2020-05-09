read();
function read() {
  const line = document.getElementById('line');

  const http = new XMLHttpRequest();
  http.open('GET', 'http://localhost:3000/people/find/', true);

  http.onreadystatechange = function() {
    if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      const objJSON = JSON.parse(http.responseText);

      var pageLength = 9;
      var numberPage = 0;

      function page() {
        $('table > tbody > tr').remove();
        var tbody = $('table > tbody');
        for (var data = numberPage * pageLength; data < objJSON.length && data < (numberPage + 1) *  pageLength; data++) {
          tbody.append(
              $('<tr>')
                .append($('<td>').append(objJSON[data].code))
                .append($('<td>').append(objJSON[data].name))
                .append($('<td>').append(objJSON[data].age))
                .append($('<td>').append(objJSON[data].email))
                .append($('<td>').append(`<button class="btn btn-info" onclick="select(${objJSON[data].code})">
                                            Selecionar
                                          </button>`))
          )
        }
        $('#numeration').text('Página ' + (numberPage + 1) + ' de ' + Math.ceil(objJSON.length / pageLength));
      }

      function adjustButtons() {
        $('#next').prop('disabled', objJSON.length <= pageLength || numberPage > objJSON.length / pageLength - 1);
        $('#previous').prop('disabled', objJSON.length <= pageLength || numberPage == 0);
      }

      $(function() {
        $('#next').click(function() {
          if (numberPage < objJSON.length / pageLength - 1) {
              numberPage++;
              page();
              adjustButtons();
          }
        });
        $('#previous').click(function() {
          if (numberPage > 0) {
              numberPage--;
              page();
              adjustButtons();
          }
        });
        page();
        adjustButtons();
      })

      let countRecord = `Total de Registros: ${objJSON.length}`
      count.innerHTML = countRecord;
    }
  }
  http.send();
}

function select(_code=0) {
  const code = document.getElementById('code');
  const name = document.getElementById('name');
  const age = document.getElementById('age');
  const email = document.getElementById('email');
  const cpf = document.getElementById('cpf');
  const rg = document.getElementById('rg');
  const nickname = document.getElementById('nickname');
  const cellphone = document.getElementById('cellphone');
  const gender = document.getElementById('gender');

  const http = new XMLHttpRequest();
  http.open('GET', 'http://localhost:3000/people/find/'+_code, true);

  http.onreadystatechange = function() {
    if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      const objJSON = JSON.parse(http.responseText);

      code.value = objJSON.code;
      name.value = objJSON.name;
      age.value = objJSON.age;
      email.value = objJSON.email;
      cpf.value = objJSON.cpf;
      rg.value = objJSON.rg;
      nickname.value = objJSON.nickname;
      cellphone.value = objJSON.cellphone;
      gender.value = objJSON.gender;
    }
  }
  http.send();	
}

function clean() {
  document.getElementById('code').value = 0;
  document.getElementById('name').value = '';
  document.getElementById('age').value = '';
  document.getElementById('email').value = '';
  document.getElementById('cpf').value = '';
  document.getElementById('rg').value = '';
  document.getElementById('nickname').value = '';
  document.getElementById('cellphone').value = '';
  document.getElementById('gender').value = '';
  document.getElementById('name').focus();
}

function save() {
  const code = Number(document.getElementById('code').value);
  const name = document.getElementById('name').value.toString().trim();
  const age = Number(document.getElementById('age').value);
  const email = document.getElementById('email').value.toString().trim();
  const cpf = Number(document.getElementById('cpf').value);
  const rg = Number(document.getElementById('rg').value);
  const nickname = document.getElementById('nickname').value.toString().trim();
  const cellphone = Number(document.getElementById('cellphone').value);
  const gender = document.getElementById('gender').value.toString().trim();

  let url = '';
  let method = '';
  let params = {};
  let strJSON = '';
  if(code>0) {
    method = 'PUT';
    url = 'http://localhost:3000/people/edit/'+code;
    if(name.length>0) params.name = name;
    if(age>0) params.age = age;
    if(email.length>0) params.email = email;
  }else {
    method = 'POST';
    url = 'http://localhost:3000/people/create';
    params.name = name;
    params.age = age;
    params.email = email;
    params.cpf = cpf;
    params.rg = rg;
    params.nickname = nickname;
    params.cellphone = cellphone;
    params.gender = gender;
  }
  strJSON = JSON.stringify(params);

  const http = new XMLHttpRequest();
  http.open(method, url, true);
  http.setRequestHeader('Content-Type', 'application/json');

  http.onreadystatechange = function() {
    if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      read();
      clean();
    }
  }
  http.send(strJSON);	
}

function deletePerson() {
  const code = Number(document.getElementById('code').value);

  if(code>0) {
    const http = new XMLHttpRequest();
    http.open('DELETE', 'http://localhost:3000/people/delete/'+code, true);

    http.onreadystatechange = function() {
      if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        read();
        clean();
      }
    }
    http.send();
  }	
}
