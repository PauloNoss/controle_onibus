const form = document.getElementById("formulario");
const tabela = document.querySelector("#tabela tbody");
let editandoId = null;

function carregarLinhas() {
  return JSON.parse(localStorage.getItem("linhas") || "[]");
}

function salvarLinhas(linhas) {
  localStorage.setItem("linhas", JSON.stringify(linhas));
}

function atualizarTabela() {
  const linhas = carregarLinhas();
  tabela.innerHTML = "";

  linhas.forEach((linha, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${linha.id}</td>
      <td>${linha.linha}</td>
      <td>${linha.horario}</td>
      <td>${linha.ponto}</td>
      <td class="acoes">
        <button class="editar" onclick="editar(${linha.id})">Editar</button>
        <button class="remover" onclick="remover(${linha.id})">Remover</button>
      </td>
    `;
    tabela.appendChild(tr);
  });
}

function validarHorario(horario) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(horario);
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("id").value.trim();
  const linha = document.getElementById("linha").value.trim();
  const horario = document.getElementById("horarioPartida").value.trim();
  const ponto = document.getElementById("pontoFinal").value.trim();

  if (!id || !linha || !horario || !ponto) {
    alert("Preencha todos os campos.");
    return;
  }

  if (parseInt(id) <= 0) {
    alert("O ID deve ser um número positivo.");
    return;
  }

  if (!validarHorario(horario)) {
    alert("Horário inválido. Use o formato HH:mm.");
    return;
  }

  const linhas = carregarLinhas();
  const existe = linhas.find((l) => l.id === id);

  if (editandoId === null && existe) {
    alert("Esse ID já está cadastrado.");
    return;
  }

  const novaLinha = { id, linha, horario, ponto };

  if (editandoId !== null) {
    const i = linhas.findIndex(l => l.id === editandoId);
    linhas[i] = novaLinha;
    editandoId = null;
  } else {
    linhas.push(novaLinha);
  }

  salvarLinhas(linhas);
  atualizarTabela();
  form.reset();
});

function editar(id) {
  const linhas = carregarLinhas();
  const linha = linhas.find(l => l.id === id.toString());

  if (linha) {
    document.getElementById("id").value = linha.id;
    document.getElementById("linha").value = linha.linha;
    document.getElementById("horarioPartida").value = linha.horario;
    document.getElementById("pontoFinal").value = linha.ponto;
    editandoId = linha.id;
  }
}

function remover(id) {
  if (!confirm("Tem certeza que deseja remover esta linha?")) return;

  let linhas = carregarLinhas();
  linhas = linhas.filter(l => l.id !== id.toString());
  salvarLinhas(linhas);
  atualizarTabela();
}

atualizarTabela();
