const { execSync } = require('child_process');

try {
    const output = execSync('npx medusa exec ./src/scripts/check-env.ts', { cwd: 'apps/backend' });
    console.log(output.toString());
} catch (e) {
    console.error(e.stdout?.toString() || e.message);
}
