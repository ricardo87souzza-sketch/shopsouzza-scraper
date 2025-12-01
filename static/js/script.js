class ShopsouzzaScraper {
    constructor() {
        this.currentExecutionId = null;
        this.statusInterval = null;
        this.startTime = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkSystemStatus();
    }

    bindEvents() {
        // Upload form
        document.getElementById('uploadForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.uploadScraper();
        });
    }

    async executeScraper(scraperId) {
        this.showLoading();
        this.startTime = Date.now();

        try {
            const response = await fetch('/api/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    scraper_id: scraperId
                })
            });

            const data = await response.json();

            if (data.status === 'success') {
                this.updateStatus('completed', data.message, 100, 1);
                this.showSuccess(data.message);
            } else {
                throw new Error(data.error || 'Erro ao iniciar scraper');
            }
        } catch (error) {
            this.hideLoading();
            this.updateStatus('error', `Erro: ${error.message}`, 0);
            console.error('Erro ao executar scraper:', error);
        } finally {
            this.hideLoading();
        }
    }

    updateStatus(status, message, progress, productsFound = 0) {
        // Atualizar mensagem de status
        const statusElement = document.getElementById('statusMessage');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `status-message status-${status}`;
        }

        // Atualizar barra de progresso
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `${progress}%`;

        // Atualizar estatísticas
        const statsGrid = document.getElementById('statsGrid');
        const productsCount = document.getElementById('productsCount');
        const executionTime = document.getElementById('executionTime');
        const statusBadge = document.getElementById('statusBadge');

        if (progress > 0 && statsGrid) {
            statsGrid.style.display = 'grid';
            if (productsCount) productsCount.textContent = productsFound;
            
            const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
            if (executionTime) executionTime.textContent = `${elapsedTime}s`;
            
            // Atualizar badge de status
            const statusMap = {
                'running': { text: 'Executando', class: 'status-running' },
                'completed': { text: 'Concluído', class: 'status-completed' },
                'error': { text: 'Erro', class: 'status-error' }
            };
            
            const statusInfo = statusMap[status] || { text: 'Desconhecido', class: '' };
            if (statusBadge) {
                statusBadge.textContent = statusInfo.text;
                statusBadge.className = `stat-value ${statusInfo.class}`;
            }
        }
    }

    async checkSystemStatus() {
        try {
            const response = await fetch('/health');
            const status = await response.json();
            
            if (status.status === 'healthy') {
                console.log('✅ Sistema online e funcionando');
            }
        } catch (error) {
            console.error('❌ Erro ao verificar status do sistema:', error);
        }
    }

    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.style.display = 'flex';
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.style.display = 'none';
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        // Estilos da notificação
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--accent-color)' : 'var(--error-color)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: var(--glass-shadow);
            backdrop-filter: var(--glass-backdrop);
            border: 1px solid var(--glass-border);
            z-index: 1001;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remover após 5 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
}

// CSS para animações das notificações
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);

// Inicializar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.scraperApp = new ShopsouzzaScraper();
});

// Função global para executar scrapers
function executeScraper(scraperId) {
    if (window.scraperApp) {
        window.scraperApp.executeScraper(scraperId);
    }
}

function showComingSoon() {
    alert('🚀 Funcionalidade em desenvolvimento! Em breve você poderá adicionar novos scrapers.');
}
