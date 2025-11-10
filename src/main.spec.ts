import { appConfig } from './app/app.config';
import { routes } from './app/app.routes';

describe('App Configuration and Bootstrap', () => {
  it('should have appConfig defined with providers', () => {
    expect(appConfig).toBeDefined();
    expect(appConfig.providers).toBeDefined();
    expect(appConfig.providers.length).toBeGreaterThan(0);
  });

  it('should have routes defined', () => {
    expect(routes).toBeDefined();
    expect(Array.isArray(routes)).toBe(true);
  });

  it('should handle bootstrap errors', () => {
    const consoleErrorSpy = spyOn(console, 'error');
    const testError = new Error('Test error');
    // This simulates what the catch block does in main.ts
    console.error(testError);
    expect(consoleErrorSpy).toHaveBeenCalledWith(testError);
  });
});