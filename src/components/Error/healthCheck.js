// services/healthCheck.js
export default {
  intervalId: null,

  async checkServerHealth() {
    // Для локальной разработки - всегда успех
    if (import.meta.env.DEV || window.location.hostname === 'localhost') {
      console.log('Локальная разработка: пропускаем проверку сервера');
      return true;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch('/api/health', {
        method: 'GET',
        signal: controller.signal
      }).catch(() => {
        // Ошибка сети - сервер недоступен
        return null;
      });

      clearTimeout(timeoutId);

      if (!response || !response.ok) {
        window.dispatchEvent(new CustomEvent('server-down'));
        return false;
      }

      // Если сервер снова стал доступен
      window.dispatchEvent(new CustomEvent('server-up'));
      return true;

    } catch (error) {
      console.error('Сервер недоступен:', error.message);
      window.dispatchEvent(new CustomEvent('server-down'));
      return false;
    }
  },

  startHealthCheck(interval = 30000) {
    // Не запускаем проверку в локальной разработке
    if (import.meta.env.DEV || window.location.hostname === 'localhost') {
      console.log('Локальная разработка: health check отключен');
      return;
    }

    // Очищаем предыдущий интервал если был
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(async () => {
      await this.checkServerHealth();
    }, interval);
  },

  stopHealthCheck() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
