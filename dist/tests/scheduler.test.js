import Scheduler, { STATES } from '../scheduler';
import { Mizzy } from '..';
// Mock Mizzy class
jest.mock('.', () => ({
    Mizzy: jest.fn().mockImplementation(() => ({
        onMessage: jest.fn(),
        send: jest.fn()
    }))
}));
describe('Scheduler', () => {
    let scheduler;
    let mizzy;
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        mizzy = new Mizzy();
        scheduler = new Scheduler(mizzy);
    });
    describe('Constructor', () => {
        it('should initialize with default values', () => {
            expect(scheduler['state']).toBe(STATES.STOPPED);
            expect(scheduler['playing']).toBe(false);
            expect(scheduler['recording']).toBe(false);
            expect(scheduler['loop']).toBe(true);
        });
    });
    describe('Schedule Management', () => {
        it('should add items to schedule', () => {
            const testData = { note: 60, velocity: 100 };
            scheduler.addToSchedule(testData, 1000);
            expect(scheduler['schedule']).toHaveLength(1);
            expect(scheduler['schedule'][0]).toEqual({
                timestamp: 1000,
                data: testData
            });
        });
        it('should reset schedule', () => {
            scheduler.addToSchedule({ note: 60 }, 1000);
            scheduler.addToSchedule({ note: 62 }, 2000);
            const oldSchedule = scheduler.reset();
            expect(oldSchedule).toHaveLength(2);
            expect(scheduler['schedule']).toHaveLength(0);
            expect(scheduler['length']).toBe(1000);
        });
    });
    describe('Playback Controls', () => {
        it('should change state to PLAYING when play is called', () => {
            scheduler.play();
            expect(scheduler['state']).toBe(STATES.PLAYING);
            expect(scheduler['playing']).toBe(true);
        });
        it('should change state to STOPPED when stop is called', () => {
            scheduler.play();
            scheduler.stop();
            expect(scheduler['state']).toBe(STATES.STOPPED);
            expect(scheduler['playing']).toBe(false);
        });
        it('should handle recording state correctly', () => {
            scheduler.record(false);
            expect(scheduler['state']).toBe(STATES.RECORDING);
            expect(scheduler['recording']).toBe(true);
            scheduler.stop();
            expect(scheduler['state']).toBe(STATES.STOPPED);
            expect(scheduler['recording']).toBe(false);
        });
    });
    describe('MIDI Clock Handling', () => {
        it('should process MIDI clock messages when playing', () => {
            // Get the first onMessage callback (clock handler)
            const clockHandler = mizzy.onMessage.mock.calls[0][0];
            scheduler.play();
            // Simulate MIDI clock message
            clockHandler({ data: [0xF8] });
            expect(scheduler['clockCount']).toBe(1);
        });
        it('should handle MIDI start message', () => {
            // Get the second onMessage callback (control handler)
            const controlHandler = mizzy.onMessage.mock.calls[1][0];
            controlHandler({ data: [0xFA] }); // Start message
            expect(scheduler['state']).toBe(STATES.PLAYING);
            expect(scheduler['playing']).toBe(true);
        });
    });
    describe('Time Management', () => {
        it('should calculate correct time ratio', () => {
            jest.spyOn(Date, 'now').mockImplementation(() => 1000);
            scheduler['startTime'] = 0;
            scheduler['length'] = 1000;
            scheduler['speed'] = 1;
            expect(scheduler.timeRatio).toBe(1);
        });
        it('should seek to correct position', () => {
            jest.spyOn(Date, 'now').mockImplementation(() => 1000);
            scheduler.seek(0.5);
            expect(scheduler['startTime']).toBe(500);
        });
    });
});
//# sourceMappingURL=scheduler.test.js.map