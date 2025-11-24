// Simple script to run the comprehensive database seeding
const { execSync } = require('child_process');

try {
    console.log('🚀 Starting comprehensive database seeding...');

    // Run the seeding script using tsx
    execSync('npx tsx data/seedComprehensive.ts', {
        stdio: 'inherit',
        cwd: process.cwd()
    });

    console.log('✅ Database seeding completed successfully!');
} catch (error) {
    console.error('❌ Database seeding failed:', error.message);
    process.exit(1);
}