#!/usr/bin/env node

/**
 * RoWorks Build Script
 * .env 파일의 환경변수를 HTML 파일에 주입합니다
 */

const fs = require('fs');
const path = require('path');

// .env 파일 로드
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env 파일이 없습니다!');
    console.log('💡 .env.example을 .env로 복사하고 실제 값을 입력하세요.');
    process.exit(1);
  }
  
  const envFile = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  
  envFile.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      env[key.trim()] = valueParts.join('=').trim();
    }
  });
  
  return env;
}

// HTML 파일 빌드
function buildHTML() {
  const env = loadEnv();
  
  // 필수 환경변수 체크
  if (!env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY가 .env 파일에 없습니다!');
    process.exit(1);
  }
  
  // HTML 템플릿 읽기
  const templatePath = path.join(__dirname, 'roworks-final.html');
  let html = fs.readFileSync(templatePath, 'utf-8');
  
  // 환경변수 주입
  html = html.replace(/VITE_ANTHROPIC_API_KEY/g, env.ANTHROPIC_API_KEY || '');
  html = html.replace(/VITE_DISCORD_CLIENT_ID/g, env.DISCORD_CLIENT_ID || '1431242474768044070');
  
  // dist 폴더 생성
  const distPath = path.join(__dirname, 'dist');
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath);
  }
  
  // 빌드된 파일 저장
  const outputPath = path.join(distPath, 'index.html');
  fs.writeFileSync(outputPath, html, 'utf-8');
  
  console.log('✅ 빌드 완료!');
  console.log('📁 출력 파일:', outputPath);
  console.log('');
  console.log('🚀 로컬 서버 실행:');
  console.log('   npx http-server dist -p 8080');
}

// 실행
try {
  buildHTML();
} catch (error) {
  console.error('❌ 빌드 오류:', error.message);
  process.exit(1);
}
