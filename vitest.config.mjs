import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'happy-dom',
        globals: true,
        include: ['tests/unit/**/*.{test,spec}.{js,ts}'],
        exclude: ['tests/e2e/**', 'node_modules/**', 'docs/**', 'android/**'],
        // Worker-Pool auf single-fork festnageln. Vermeidet seltsame
        // tinypool-Worker-Crashes auf Ubuntu-CI.
        pool: 'forks',
        poolOptions: {
            forks: { singleFork: true },
        },
        reporters: process.env.CI ? ['default', 'github-actions'] : ['default'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'json-summary'],
            include: ['public/js/lib/**/*.js', 'src/scripts/**/*.js'],
            thresholds: {
                lines: 60,
                functions: 60,
                branches: 50,
                statements: 60,
            },
        },
    },
});
