import { logEvent } from '../analytics';

describe('analytics', () => {
  let mockSaEvent: jest.Mock;

  beforeEach(() => {
    // Clear all mocks between tests
    mockSaEvent = jest.fn();
    // Mock the window object
    Object.defineProperty(window, 'sa_event', {
      writable: true,
      value: mockSaEvent,
    });
  });

  afterEach(() => {
    // Clean up after each test
    delete (window as any).sa_event;
  });

  it('should call sa_event with correct parameters when available', () => {
    const eventName = 'test_event';
    const eventData = { foo: 'bar' };

    logEvent(eventName, eventData);

    expect(mockSaEvent).toHaveBeenCalledWith(eventName, eventData);
    expect(mockSaEvent).toHaveBeenCalledTimes(1);
  });

  it('should call sa_event with only eventName when no data provided', () => {
    const eventName = 'test_event';

    logEvent(eventName);

    expect(mockSaEvent).toHaveBeenCalledWith(eventName, undefined);
    expect(mockSaEvent).toHaveBeenCalledTimes(1);
  });

  it('should not throw when sa_event is not available', () => {
    delete (window as any).sa_event;

    expect(() => {
      logEvent('test_event', { foo: 'bar' });
    }).not.toThrow();
  });
}); 