function revealOnScroll() {
  const elements = document.querySelectorAll('.reveal');
  const windowHeight = window.innerHeight;
  const revealPoint = 150;

  elements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;

    if (elementTop < windowHeight - revealPoint) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll); // Ativa animação inicial

function revealOnScroll() {
  const elements = document.querySelectorAll('.reveal');
  const windowHeight = window.innerHeight;
  const revealPoint = 150;

  elements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;

    if (elementTop < windowHeight - revealPoint) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll); // Ativa animação inicial

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const turmaSelect = document.getElementById('turma-select');
    const diaSelect = document.getElementById('dia-select');
    const horarioTitle = document.getElementById('horario-title');
    const horarioTable = document.querySelector('.horario-table');
    const avisosContainer = document.querySelector('.avisos-container');
    
    // Dados simulados (na prática, viriam de uma API)
    let turmas = [];
    let horarios = {};
    let avisos = [];
    
    // Verificar se o usuário é admin
    const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
    if (isAdmin) {
        document.getElementById('admin-link').textContent = 'Painel Admin';
    }
    
    // Carregar dados iniciais
    fetchData();
    
    // Event listeners
    turmaSelect.addEventListener('change', updateHorario);
    diaSelect.addEventListener('change', updateHorario);
    
    // Função para carregar dados
    async function fetchData() {
        try {
            // Simular requisição à API
            const response = await fetch('data/horarios.json');
            const data = await response.json();
            
            turmas = data.turmas;
            horarios = data.horarios;
            avisos = data.avisos;
            
            // Preencher dropdown de turmas
            populateTurmas();
            
            // Carregar horário inicial
            updateHorario();
            
            // Carregar avisos
            displayAvisos();
            
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    }
    
    // Preencher dropdown de turmas
    function populateTurmas() {
        turmaSelect.innerHTML = '<option value="">Selecione uma turma</option>';
        
        turmas.forEach(turma => {
            const option = document.createElement('option');
            option.value = turma.id;
            option.textContent = turma.nome;
            turmaSelect.appendChild(option);
        });
    }
    
    // Atualizar tabela de horário
    function updateHorario() {
        const turmaId = turmaSelect.value;
        const dia = diaSelect.value;
        
        if (!turmaId) {
            horarioTable.innerHTML = '<p>Selecione uma turma para visualizar o horário.</p>';
            horarioTitle.textContent = 'Horário da Turma';
            return;
        }
        
        const turma = turmas.find(t => t.id === turmaId);
        const horarioDia = horarios[turmaId]?.[dia] || [];
        
        horarioTitle.textContent = `Horário da ${turma.nome} - ${getDiaNome(dia)}`;
        
        // Criar tabela de horário
        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Horário</th>
                        <th>Disciplina</th>
                        <th>Professor</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        if (horarioDia.length === 0) {
            tableHTML += `
                <tr>
                    <td colspan="3" style="text-align: center;">Nenhuma aula cadastrada para este dia.</td>
                </tr>
            `;
        } else {
            horarioDia.forEach(aula => {
                tableHTML += `
                    <tr>
                        <td>${aula.horario}</td>
                        <td>${aula.disciplina}</td>
                        <td>${aula.professor}</td>
                    </tr>
                `;
            });
        }
        
        tableHTML += `
                </tbody>
            </table>
        `;
        
        horarioTable.innerHTML = tableHTML;
    }
    
    // Mostrar avisos
    function displayAvisos() {
        if (avisos.length === 0) {
            avisosContainer.innerHTML = '<p>Nenhum aviso no momento.</p>';
            return;
        }
        
        let avisosHTML = '';
        
        avisos.forEach(aviso => {
            avisosHTML += `
                <div class="aviso-item">
                    <h3>${aviso.titulo}</h3>
                    <div class="data">${formatDate(aviso.data)}</div>
                    <p>${aviso.mensagem}</p>
                </div>
            `;
        });
        
        avisosContainer.innerHTML = avisosHTML;
    }
    
    // Funções auxiliares
    function getDiaNome(dia) {
        const dias = {
            'segunda': 'Segunda-feira',
            'terca': 'Terça-feira',
            'quarta': 'Quarta-feira',
            'quinta': 'Quinta-feira',
            'sexta': 'Sexta-feira'
        };
        return dias[dia] || dia;
    }
    
    function formatDate(dateString) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    }
});

// Adicione esta função no script.js
function applyProfessorStatus() {
    const hoje = new Date().toISOString().split('T')[0]; // Data atual no formato YYYY-MM-DD
    const professoresFaltaram = JSON.parse(localStorage.getItem('faltas')) || {};
    const professoresDoDia = professoresFaltaram[hoje] || {};

    document.querySelectorAll('.horario-table tr').forEach(row => {
        const professorCell = row.cells[2]; // Célula do professor
        if (!professorCell) return;

        const professorNome = professorCell.textContent.trim();
        const status = professoresDoDia[professorNome];

        // Resetar classes
        professorCell.className = '';
        
        if (status === 'falta') {
            professorCell.classList.add('professor-falta');
        } else if (status === 'ausente') {
            professorCell.classList.add('professor-ausente');
        } else if (status === 'presente') {
            professorCell.classList.add('professor-presente');
        }
    });
}

// Chame esta função após carregar o horário (dentro da função updateHorario)
function updateHorario() {
    // ... código existente ...
    
    // Adicione esta linha no final da função:
    setTimeout(applyProfessorStatus, 100);
}

// Adicione esta função para limpar status antigos
function cleanOldStatus() {
    const hoje = new Date().toISOString().split('T')[0];
    let professoresFaltaram = JSON.parse(localStorage.getItem('faltas')) || {};
    
    // Manter apenas os dados dos últimos 7 dias
    for (const data in professoresFaltaram) {
        if (data < hoje && data !== hoje) {
            delete professoresFaltaram[data];
        }
    }
    
    localStorage.setItem('faltas', JSON.stringify(professoresFaltaram));
}

// Chame no carregamento do admin.js
cleanOldStatus();


setInterval(applyProfessorStatus, 30000);

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const turmaSelect = document.getElementById('turma-select');
    const diaSelect = document.getElementById('dia-select');
    const horarioTitle = document.getElementById('horario-title');
    const horarioTable = document.querySelector('.horario-table');
    const avisosContainer = document.querySelector('.avisos-container');
    
    // Dados simulados (na prática, viriam de uma API)
    let turmas = [];
    let horarios = {};
    let avisos = [];
    
    // Verificar se o usuário é admin
    const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
    if (isAdmin) {
        document.getElementById('admin-link').textContent = 'Painel Admin';
    }
    
    // Carregar dados iniciais
    fetchData();
    
    // Event listeners
    turmaSelect.addEventListener('change', updateHorario);
    diaSelect.addEventListener('change', updateHorario);
    
    // Função para carregar dados
    async function fetchData() {
        try {
            // Simular requisição à API
            const response = await fetch('data/horarios.json');
            const data = await response.json();
            
            turmas = data.turmas;
            horarios = data.horarios;
            avisos = data.avisos;
            
            // Preencher dropdown de turmas
            populateTurmas();
            
            // Carregar horário inicial
            updateHorario();
            
            // Carregar avisos
            displayAvisos();
            
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    }
    
    // Preencher dropdown de turmas
    function populateTurmas() {
        turmaSelect.innerHTML = '<option value="">Selecione uma turma</option>';
        
        turmas.forEach(turma => {
            const option = document.createElement('option');
            option.value = turma.id;
            option.textContent = turma.nome;
            turmaSelect.appendChild(option);
        });
    }
    
    // Atualizar tabela de horário
    function updateHorario() {
        const turmaId = turmaSelect.value;
        const dia = diaSelect.value;
        
        if (!turmaId) {
            horarioTable.innerHTML = '<p>Selecione uma turma para visualizar o horário.</p>';
            horarioTitle.textContent = 'Horário da Turma';
            return;
        }
        
        const turma = turmas.find(t => t.id === turmaId);
        const horarioDia = horarios[turmaId]?.[dia] || [];
        
        horarioTitle.textContent = `Horário da ${turma.nome} - ${getDiaNome(dia)}`;
        
        // Criar tabela de horário
        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Horário</th>
                        <th>Disciplina</th>
                        <th>Professor</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        if (horarioDia.length === 0) {
            tableHTML += `
                <tr>
                    <td colspan="3" style="text-align: center;">Nenhuma aula cadastrada para este dia.</td>
                </tr>
            `;
        } else {
            horarioDia.forEach(aula => {
                tableHTML += `
                    <tr>
                        <td>${aula.horario}</td>
                        <td>${aula.disciplina}</td>
                        <td>${aula.professor}</td>
                    </tr>
                `;
            });
        }
        
        tableHTML += `
                </tbody>
            </table>
        `;
        
        horarioTable.innerHTML = tableHTML;
    }
    
    // Mostrar avisos
    function displayAvisos() {
        if (avisos.length === 0) {
            avisosContainer.innerHTML = '<p>Nenhum aviso no momento.</p>';
            return;
        }
        
        let avisosHTML = '';
        
        avisos.forEach(aviso => {
            avisosHTML += `
                <div class="aviso-item">
                    <h3>${aviso.titulo}</h3>
                    <div class="data">${formatDate(aviso.data)}</div>
                    <p>${aviso.mensagem}</p>
                </div>
            `;
        });
        
        avisosContainer.innerHTML = avisosHTML;
    }
    
    // Funções auxiliares
    function getDiaNome(dia) {
        const dias = {
            'segunda': 'Segunda-feira',
            'terca': 'Terça-feira',
            'quarta': 'Quarta-feira',
            'quinta': 'Quinta-feira',
            'sexta': 'Sexta-feira'
        };
        return dias[dia] || dia;
    }
    
    function formatDate(dateString) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    }
});