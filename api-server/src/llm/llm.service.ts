import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LlmService {
    private OLLAMA_URL = 'http://localhost:11434/api/generate';

    private models = [
        'mistral',
        'gemma',
        // 'deepseek-r1',
    ];

    private async askModel(model: string, prompt: string) {
        try {
            const res = await axios.post(this.OLLAMA_URL, {
                model,
                prompt,
                stream: false,
            },
                // { timeout: 90000 } // 90 seconds max
            );

            return {
                model,
                answer: res.data.response,
            };
        } catch (error) {
            return {
                model,
                answer: null,
                error: 'timeout or failed',
            };
        }
    }

    async askAll(prompt: string) {
        const requests = this.models.map((model) =>
            this.askModel(model, prompt),
        );

        return Promise.all(requests);
    }
}
