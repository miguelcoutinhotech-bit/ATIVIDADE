// ===== Padrões: o 0 é um número digitado, qualquer outro símbolo é obrigatório =====
const MASCARA_CPF      = "000.000.000-00";
const MASCARA_REGISTRO = "0000-00.00_00-00*000";

// ===== Matrícula: campo totalmente mascarado =====
// Coloque aqui o SEU número de matrícula do Cotemig (entre aspas)
const MATRICULA = "22500715";

// Aplica a máscara sem usar regex
function aplicarMascara(texto, mascara) {
  // 1) pega somente os dígitos digitados
  let digitos = "";
  for (let i = 0; i < texto.length; i++) {
    if (texto[i] >= "0" && texto[i] <= "9") {
      digitos += texto[i];
    }
  }

  // 2) monta o resultado seguindo o padrão
  let resultado = "";
  let d = 0;
  for (let m = 0; m < mascara.length; m++) {
    if (d >= digitos.length) break;

    if (mascara[m] === "0") {
      resultado += digitos[d];
      d++;
    } else {
      resultado += mascara[m]; // símbolo obrigatório
    }
  }
  return resultado;
}

// Liga a máscara de CPF / registro em um campo
function ligarMascara(id, mascara) {
  const campo = document.getElementById(id);
  campo.maxLength = mascara.length;
  campo.addEventListener("input", function () {
    campo.value = aplicarMascara(campo.value, mascara);
  });
}

// Campo totalmente mascarado: não importa o que for digitado,
// o resultado é sempre o começo do número de matrícula
function ligarMascaraTotal(id, fixo) {
  const campo = document.getElementById(id);
  campo.maxLength = fixo.length;
  campo.addEventListener("input", function () {
    campo.value = fixo.substring(0, campo.value.length);
  });
}

// ====================== TELA 01 ======================
const form = document.getElementById("formCadastro");

if (form) {
  ligarMascara("cpf", MASCARA_CPF);
  ligarMascara("registro", MASCARA_REGISTRO);
  ligarMascaraTotal("matricula", MATRICULA);

  document.getElementById("btnProxima").addEventListener("click", function () {
    window.location.href = "tela2.html";
  });

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const cpf       = document.getElementById("cpf").value;
    const registro  = document.getElementById("registro").value;
    const matricula = document.getElementById("matricula").value;
    const nome      = document.getElementById("nome").value;

    // confere se todos os campos foram preenchidos por completo
    if (cpf.length !== MASCARA_CPF.length ||
        registro.length !== MASCARA_REGISTRO.length ||
        matricula.length !== MATRICULA.length) {
      alert("Preencha todos os campos corretamente!");
      return;
    }

    // grava no localStorage
    const dados = {
      cpf: cpf,
      registro: registro,
      matricula: matricula,
      nome: nome
    };
    localStorage.setItem("cadastro", JSON.stringify(dados));

    // vai para a segunda tela
    window.location.href = "tela2.html";
  });
}

// ====================== TELA 02 ======================
const btnAbrir = document.getElementById("btnAbrir");

if (btnAbrir) {
  const fundo = document.getElementById("fundoModal");

  // lê do localStorage e mostra no modal
  function mostrarDados() {
    const dados = JSON.parse(localStorage.getItem("cadastro"));

    if (dados) {
      document.getElementById("mCpf").value       = dados.cpf;
      document.getElementById("mRegistro").value  = dados.registro;
      document.getElementById("mMatricula").value = dados.matricula;
      document.getElementById("mNome").value      = dados.nome;
    } else {
      document.getElementById("mCpf").value = "Nenhum dado cadastrado";
    }

    fundo.classList.add("aberto");
  }

  btnAbrir.addEventListener("click", mostrarDados);

  document.getElementById("btnFechar").addEventListener("click", function () {
    fundo.classList.remove("aberto");
  });

  document.getElementById("btnVoltar").addEventListener("click", function () {
    window.location.href = "index.html";
  });
}
