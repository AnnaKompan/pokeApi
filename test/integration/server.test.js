const request = require('supertest');
const app = require('../../server'); // Ensure server.js exports app
const fetch = require('node-fetch');

// Mock node-fetch
jest.mock('node-fetch');

describe('Integration: /api/openai', () => {
    beforeAll(() => {
        process.env.OPENAI_API_KEY = 'test-key';
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return default response if prompt is missing', async () => {
        const res = await request(app)
            .post('/api/openai')
            .send({});

        expect(res.statusCode).toBe(200);
        expect(res.body.result).toBe('Mewtwo, will make it happen');
    });

    it('should return successfully when OpenAI calls succeed', async () => {
        const mockResponse = {
            ok: true,
            json: async () => ({
                choices: [{ message: { content: 'Pikachu: electric\nSquirtle: water' } }]
            })
        };
        fetch.mockResolvedValue(mockResponse);

        const res = await request(app)
            .post('/api/openai')
            .send({ prompt: 'test' });

        expect(res.statusCode).toBe(200);
        expect(res.body.result).toContain('Pikachu: electric');
        // Should have called OpenAI
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should retry 3 times on API failure then fallback', async () => {
        const mockFailure = {
            ok: false,
            status: 500
        };
        fetch.mockResolvedValue(mockFailure);

        const res = await request(app)
            .post('/api/openai')
            .send({ prompt: 'test' });

        // Should try 3 times
        expect(fetch).toHaveBeenCalledTimes(3);
        // Fallback
        expect(res.body.result).toBe('Mewtwo, will make it happen');
    });

    it('should fallback if response format is invalid', async () => {
        const mockInvalidFormat = {
            ok: true,
            json: async () => ({
                choices: [{ message: { content: 'Just some text without colons' } }]
            })
        };
        fetch.mockResolvedValue(mockInvalidFormat);

        const res = await request(app)
            .post('/api/openai')
            .send({ prompt: 'test' });

        expect(fetch).toHaveBeenCalledTimes(3); // Should retry thinking it was a fluke
        expect(res.body.result).toBe('Mewtwo, will make it happen');
    });
});
