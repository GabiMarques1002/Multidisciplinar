document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const periodoSelect = document.getElementById('admin-periodo');
    const diaSelect = document.getElementById('admin-dia');
    const horarioEditor = document.querySelector('.horario-editor');
    const saveBtn = document.getElementById('salvar-horario');
    const avisoForm = document.getElementById('aviso-form');
    const avisosList = document.querySelector('.avisos-list');
    const faltasContainer = document.querySelector('.faltas-container');
    
    // Dados simulados
    let turmas = [];
    let horarios = {};
    let professores = [];
    let avisos = [];
    
    // Carregar dados iniciais
    fetchData();
    
    // Configurar tabs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Atualizar botões ativos
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Atualizar conteúdos visíveis
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Event listeners
    periodoSelect.addEventListener('change', loadHorarioEditor);
    diaSelect.addEventListener('change', loadHorarioEditor);
    saveBtn.addEventListener('click', saveHorario);
    if (avisoForm) {
        avisoForm.addEventListener('submit', addAviso);
    }
    
    // Função para carregar dados
    async function fetchData() {
        try {
            // Simular requisição à API
            const response = await fetch('data/horarios.json');
            const data = await response.json();
            
            turmas = data.turmas;
            horarios = data.horarios;
            professores = data.professores;
            avisos = data.avisos;
            
            // Preencher dropdown de turmas
            populateTurmas();
            
            // Carregar editor de horário
            loadHorarioEditor();
            
            // Carregar lista de professores
            loadProfessores();
            
            // Carregar avisos existentes
            loadAvisos();
            
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            showStatusMessage('Erro ao carregar dados. Tente novamente.', 'error');
        }
    }
    
    // Preencher dropdown de turmas
    function populateTurmas() {
        periodoSelect.innerHTML = '<option value="">Selecione uma turma</option>';
        
        turmas.forEach(turma => {
            const option = document.createElement('option');
            option.value = turma.id;
            option.textContent = turma.nome;
            periodoSelect.appendChild(option);
        });
    }
    
    // Carregar editor de horário
    function loadHorarioEditor() {
        const turmaId = periodoSelect.value;
        const dia = diaSelect.value;
        
        if (!turmaId) {
            horarioEditor.innerHTML = '<p>Selecione uma turma para editar o horário.</p>';
            return;
        }
        
        const turma = turmas.find(t => t.id === turmaId);
        const horarioDia = horarios[turmaId]?.[dia] || [];
        
        // Criar tabela de edição
        let editorHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Horário</th>
                        <th>Disciplina</th>
                        <th>Professor</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        // Adicionar aulas existentes
        if (horarioDia.length > 0) {
            horarioDia.forEach((aula, index) => {
                editorHTML += createAulaRow(aula, index);
            });
        } else {
            editorHTML += `
                <tr class="empty-row">
                    <td colspan="4" style="text-align: center;">Nenhuma aula cadastrada para este dia.</td>
                </tr>
            `;
        }
        
        editorHTML += `
                </tbody>
            </table>
            <button type="button" class="btn btn-add-aula" style="margin-top: 1rem;">
                <i class="fas fa-plus"></i> Adicionar Aula
            </button>
        `;
        
        horarioEditor.innerHTML = editorHTML;
        
        // Adicionar event listeners para os botões de adicionar aula
        const addBtn = document.querySelector('.btn-add-aula');
        if (addBtn) {
            addBtn.addEventListener('click', addAulaRow);
        }
        
        // Adicionar event listeners para os botões de remover aula
        document.querySelectorAll('.btn-remove-aula').forEach(btn => {
            btn.addEventListener('click', function() {
                const row = this.closest('tr');
                row.remove();
                
                // Se não houver mais linhas, adicionar a linha vazia
                if (document.querySelector('tbody').children.length === 0) {
                    const tbody = document.querySelector('tbody');
                    tbody.innerHTML = `
                        <tr class="empty-row">
                            <td colspan="4" style="text-align: center;">Nenhuma aula cadastrada para este dia.</td>
                        </tr>
                    `;
                }
            });
        });
    }
    
    // Criar linha de aula no editor
    function createAulaRow(aula, index) {
        return `
            <tr>
                <td><input type="text" class="aula-horario" value="${aula.horario}" required></td>
                <td><input type="text" class="aula-disciplina" value="${aula.disciplina}" required></td>
                <td>
                    <select class="aula-professor" required>
                        ${professores.map(prof => 
                            `<option value="${prof.id}" ${prof.id === aula.professorId ? 'selected' : ''}>
                                ${prof.nome}
                            </option>`
                        ).join('')}
                    </select>
                </td>
                <td>
                    <button type="button" class="btn btn-danger btn-remove-aula">
                        X
                    </button>
                </td>
            </tr>
        `;
    }
    
    // Adicionar nova linha de aula
    function addAulaRow() {
        const tbody = document.querySelector('tbody');
        
        // Remover linha vazia se existir
        const emptyRow = document.querySelector('.empty-row');
        if (emptyRow) {
            emptyRow.remove();
        }
        
        // Adicionar nova linha
        const newAula = {
            horario: '',
            disciplina: '',
            professorId: professores[0]?.id || ''
        };
        
        tbody.insertAdjacentHTML('beforeend', createAulaRow(newAula, -1));
        
        // Adicionar event listener ao botão de remover
        const lastRow = tbody.lastElementChild;
        lastRow.querySelector('.btn-remove-aula').addEventListener('click', function() {
            lastRow.remove();
            
            // Se não houver mais linhas, adicionar a linha vazia
            if (tbody.children.length === 0) {
                tbody.innerHTML = `
                    <tr class="empty-row">
                        <td colspan="4" style="text-align: center;">Nenhuma aula cadastrada para este dia.</td>
                    </tr>
                `;
            }
        });
    }
    
    // Salvar horário editado
    function saveHorario() {
        const turmaId = periodoSelect.value;
        const dia = diaSelect.value;
        
        if (!turmaId) {
            showStatusMessage('Selecione uma turma para salvar.', 'error');
            return;
        }
        
        const rows = document.querySelectorAll('tbody tr:not(.empty-row)');
        const novoHorario = [];
        
        // Validar e coletar dados
        let isValid = true;
        
        rows.forEach(row => {
            const horario = row.querySelector('.aula-horario').value.trim();
            const disciplina = row.querySelector('.aula-disciplina').value.trim();
            const professorId = row.querySelector('.aula-professor').value;
            
            if (!horario || !disciplina || !professorId) {
                isValid = false;
                return;
            }
            
            const professor = professores.find(p => p.id === professorId);
            
            novoHorario.push({
                horario,
                disciplina,
                professor: professor.nome,
                professorId
            });
        });
        
        if (!isValid) {
            showStatusMessage('Preencha todos os campos corretamente.', 'error');
            return;
        }
        
        // Atualizar dados locais (em produção, enviar para o servidor)
        if (!horarios[turmaId]) {
            horarios[turmaId] = {};
        }
        
        horarios[turmaId][dia] = novoHorario;
        
        showStatusMessage('Horário salvo com sucesso!', 'success');
        
        // Simular delay para demonstração
        setTimeout(() => {
            document.querySelector('.status-message').style.display = 'none';
        }, 3000);
    }
    
    function loadProfessores() {
    if (!faltasContainer) return;
    
    const hoje = new Date().toISOString().split('T')[0];
    const professoresFaltaram = JSON.parse(localStorage.getItem('faltas')) || {};
    const faltasHoje = professoresFaltaram[hoje] || {};

    let faltasHTML = '<h3>Status dos Professores - ' + formatDate(hoje) + '</h3>';
    
    professores.forEach(prof => {
        const statusAtual = faltasHoje[prof.nome] || 'presente';
        
        faltasHTML += `
            <div class="falta-item">
                <div class="professor-info">
                    <strong>${prof.nome}</strong> - ${prof.disciplina}
                </div>
                <div class="status-buttons">
                    <button class="status-btn ${statusAtual === 'presente' ? 'active' : ''}" 
                            data-prof="${prof.nome}" data-status="presente">
                        Presente
                    </button>
                    <button class="status-btn ${statusAtual === 'ausente' ? 'active' : ''}" 
                            data-prof="${prof.nome}" data-status="ausente">
                        Atrasado/Ausente
                    </button>
                    <button class="status-btn ${statusAtual === 'falta' ? 'active' : ''}" 
                            data-prof="${prof.nome}" data-status="falta">
                        Falta
                    </button>
                </div>
            </div>
        `;
    });
    
    faltasContainer.innerHTML = faltasHTML;
    
    // Adicionar event listeners
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const professor = this.getAttribute('data-prof');
            const status = this.getAttribute('data-status');
            updateProfessorStatus(professor, status);
        });
    });
}

function updateProfessorStatus(professor, status) {
    const hoje = new Date().toISOString().split('T')[0];
    let professoresFaltaram = JSON.parse(localStorage.getItem('faltas')) || {};
    
    if (!professoresFaltaram[hoje]) {
        professoresFaltaram[hoje] = {};
    }
    
    professoresFaltaram[hoje][professor] = status;
    localStorage.setItem('faltas', JSON.stringify(professoresFaltaram));
    
    // Atualizar UI
    loadProfessores();
    showStatusMessage(`Status de ${professor} atualizado para "${status}".`, 'success');
}
    
    // Adicionar novo aviso
    function addAviso(e) {
        e.preventDefault();
        
        const titulo = document.getElementById('aviso-titulo').value.trim();
        const mensagem = document.getElementById('aviso-mensagem').value.trim();
        
        if (!titulo || !mensagem) {
            showStatusMessage('Preencha todos os campos do aviso.', 'error');
            return;
        }
        
        const novoAviso = {
            id: Date.now().toString(),
            titulo,
            mensagem,
            data: new Date().toISOString()
        };
        
        // Adicionar ao array de avisos (em produção, enviar para o servidor)
        avisos.unshift(novoAviso);
        
        // Limpar formulário
        avisoForm.reset();
        
        // Atualizar lista de avisos
        loadAvisos();
        
        showStatusMessage('Aviso publicado com sucesso!', 'success');
    }
    
    // Carregar avisos existentes
    function loadAvisos() {
        if (!avisosList) return;
        
        let avisosHTML = '';
        
        if (avisos.length === 0) {
            avisosHTML = '<p>Nenhum aviso cadastrado.</p>';
        } else {
            avisos.forEach(aviso => {
                avisosHTML += `
                    <div class="aviso-admin-item">
                        <div class="content">
                            <h4>${aviso.titulo}</h4>
                            <p>${aviso.mensagem}</p>
                            <small>${formatDate(aviso.data)}</small>
                        </div>
                        <div class="actions">
                            <button class="btn btn-danger btn-remove-aviso" data-id="${aviso.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
        }
        
        avisosList.innerHTML = avisosHTML;
        
        // Adicionar event listeners para os botões de remover
        document.querySelectorAll('.btn-remove-aviso').forEach(btn => {
            btn.addEventListener('click', function() {
                const avisoId = this.getAttribute('data-id');
                removeAviso(avisoId);
            });
        });
    }
    
    // Remover aviso
    function removeAviso(avisoId) {
        avisos = avisos.filter(aviso => aviso.id !== avisoId);
        loadAvisos();
        showStatusMessage('Aviso removido com sucesso.', 'success');
    }
    
    // Mostrar mensagem de status
    function showStatusMessage(message, type) {
        const statusDiv = document.createElement('div');
        statusDiv.className = `status-message ${type}`;
        statusDiv.textContent = message;
        
        const firstChild = document.querySelector('.tab-content.active').firstElementChild;
        if (firstChild) {
            firstChild.insertAdjacentElement('afterend', statusDiv);
        }
        
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 3000);
    }
    
    // Funções auxiliares
    function formatDate(dateString) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    }
});