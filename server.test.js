/** @jest-environment node */

const request = require('supertest');
const app = require('./server'); // Assuming your express app is exported from server.js
const fetch = require('node-fetch');

jest.mock('node-fetch');

describe('OpenAI Proxy Server', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return 400 if prompt is missing', async () => {
        const response = await request(app)
            .post('/api/openai')
            .send({});
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Missing prompt');
    });

    it('should return 500 if OPENAI_API_KEY is missing', async () => {
        const originalApiKey = process.env.OPENAI_API_KEY;
        delete process.env.OPENAI_API_KEY;

        const response = await request(app)
            .post('/api/openai')
            .send({ prompt: 'test' });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Server missing OPENAI_API_KEY environment variable');

        process.env.OPENAI_API_KEY = originalApiKey;
    });

    it('should return the result from OpenAI', async () => {
        process.env.OPENAI_API_KEY = 'test-key';
        const mockOpenAIResponse = {
            choices: [
                {
                    message: {
                        content: 'Pikachu, good for electricity, Charmander, good for fire'
                    }
                }
            ]
        };

        fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockOpenAIResponse),
        });

        const response = await request(app)
            .post('/api/openai')
            .send({ prompt: 'test' });

        expect(response.status).toBe(200);
        expect(response.body.result).toBe('Pikachu, good for electricity, Charmander, good for fire');
    });

    it('should return an error if OpenAI response is not comma-separated', async () => {
        process.env.OPENAI_API_KEY = 'test-key';
        const mockOpenAIResponse = {
            choices: [
                {
                    message: {
                        content: 'Pikachu is good for electricity. Charmander is good for fire.'
                    }
                }
            ]
        };

        fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockOpenAIResponse),
        });

        const response = await request(app)
            .post('/api/openai')
            .send({ prompt: 'test' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid response format from OpenAI');
    });

    it('should handle null content from OpenAI gracefully', async () => {
        process.env.OPENAI_API_KEY = 'test-key';
        const mockOpenAIResponse = { choices: [{ message: { content: null } }] };
        fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockOpenAIResponse),
        });
        const response = await request(app)
            .post('/api/openai')
            .send({ prompt: 'test' });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid response format from OpenAI');
    });

    it('should return an error for empty string content from OpenAI', async () => {
        process.env.OPENAI_API_KEY = 'test-key';
        const mockOpenAIResponse = { choices: [{ message: { content: '' } }] };
        fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockOpenAIResponse),
        });
        const response = await request(app)
            .post('/api/openai')
            .send({ prompt: 'test' });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid response format from OpenAI');
    });

    it('should return an error if the response contains unallowed punctuation', async () => {
        process.env.OPENAI_API_KEY = 'test-key';
        const mockOpenAIResponse = {
            choices: [
                {
                    message: {
                        content: 'Pikachu, good for electricity. Not for fire.'
                    }
                }
            ]
        };

        fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockOpenAIResponse),
        });

        const response = await request(app)
            .post('/api/openai')
            .send({ prompt: 'test' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid response format from OpenAI');
    });
});



