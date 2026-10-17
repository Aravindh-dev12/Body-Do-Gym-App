import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

import { chromium } from '@playwright/test';
import sharp from 'sharp';

const root = join(import.meta.dirname, '..');
const assets = join(root, 'docs', 'assets');
const screens = join(assets, 'screens');
mkdirSync(screens, { recursive: true });

const URL = 'http://localhost:5173';

async function run() {
  console.log('Launching browser with MS Edge...');
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  // 1. Desktop widescreen screenshot (1440 x 900)
  console.log('Capturing desktop dashboard...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto(`${URL}/#/plan`, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1000);

  const desktopBuffer = await desktopPage.screenshot({ type: 'png' });
  await sharp(desktopBuffer)
    .png({ quality: 90, effort: 7 })
    .toFile(join(screens, 'dashboard-desktop.png'));
  console.log('✓ Saved docs/assets/screens/dashboard-desktop.png');

  // Also capture the Account / Profile modal on desktop
  console.log('Capturing profile modal...');
  try {
    const profileBtn = desktopPage
      .locator('button:visible')
      .filter({ hasText: /sign in/i })
      .first();
    if ((await profileBtn.count()) > 0) {
      await profileBtn.click();
      await desktopPage.waitForTimeout(600);
      const profileBuffer = await desktopPage.screenshot({ type: 'png' });
      await sharp(profileBuffer)
        .png({ quality: 90, effort: 7 })
        .toFile(join(screens, 'profile-modal.png'));
      console.log('✓ Saved docs/assets/screens/profile-modal.png');
      // Close modal
      await desktopPage.keyboard.press('Escape');
      await desktopPage.waitForTimeout(300);
    }
  } catch (err) {
    console.log('Note: Skipping profile modal capture:', err.message);
  }

  // 2. Mobile screen captures (390 x 844) in Dark theme
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
  });
  const mobilePage = await mobileContext.newPage();

  // Plan screen
  console.log('Capturing plan screen...');
  await mobilePage.goto(`${URL}/#/plan`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(600);
  const planPng = await mobilePage.screenshot({ type: 'png' });
  await sharp(planPng)
    .png({ palette: true, quality: 90, effort: 7 })
    .toFile(join(screens, 'plan-dark.png'));
  console.log('✓ Saved docs/assets/screens/plan-dark.png');

  // Workout / Session screen
  console.log('Capturing workout session screen...');
  await mobilePage.goto(`${URL}/#/session/2026-10-19`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(800);
  const workoutPng = await mobilePage.screenshot({ type: 'png' });
  await sharp(workoutPng)
    .png({ palette: true, quality: 90, effort: 7 })
    .toFile(join(screens, 'workout-dark.png'));
  console.log('✓ Saved docs/assets/screens/workout-dark.png');

  // Exercises & Muscle map screen
  console.log('Capturing exercises screen...');
  await mobilePage.goto(`${URL}/#/exercises`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(800);
  const exercisesPng = await mobilePage.screenshot({ type: 'png' });
  await sharp(exercisesPng)
    .png({ palette: true, quality: 90, effort: 7 })
    .toFile(join(screens, 'exercises-dark.png'));
  console.log('✓ Saved docs/assets/screens/exercises-dark.png');

  // Muscle heat map details
  console.log('Capturing muscle map...');
  await mobilePage.goto(`${URL}/#/exercises?mode=done&muscle=chest`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(800);
  const mapPng = await mobilePage.screenshot({ type: 'png' });
  await sharp(mapPng)
    .png({ palette: true, quality: 90, effort: 7 })
    .toFile(join(screens, 'map-dark.png'));
  console.log('✓ Saved docs/assets/screens/map-dark.png');

  // Progress screen
  console.log('Capturing progress screen...');
  await mobilePage.goto(`${URL}/#/progress`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(800);
  const progressPng = await mobilePage.screenshot({ type: 'png' });
  await sharp(progressPng)
    .png({ palette: true, quality: 90, effort: 7 })
    .toFile(join(screens, 'progress-dark.png'));
  console.log('✓ Saved docs/assets/screens/progress-dark.png');

  // Body screen
  console.log('Capturing body screen...');
  await mobilePage.goto(`${URL}/#/body`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(800);
  const bodyPng = await mobilePage.screenshot({ type: 'png' });
  await sharp(bodyPng)
    .png({ palette: true, quality: 90, effort: 7 })
    .toFile(join(screens, 'body-dark.png'));
  console.log('✓ Saved docs/assets/screens/body-dark.png');

  // Generate updated Hero image with modern theme
  console.log('Generating updated hero-dark.png...');
  const heroPage = await browser.newPage({
    viewport: { width: 1280, height: 640 },
    deviceScaleFactor: 2,
  });

  const heroHtml = `<!doctype html><html><head><meta charset="utf-8"><style>
    body { margin: 0; background: #000000; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; overflow: hidden; }
    .hero { position: relative; width: 1280px; height: 640px; display: flex; align-items: center; justify-content: space-between; padding: 0 60px; box-sizing: border-box; }
    .left { max-width: 540px; display: flex; flex-direction: column; gap: 20px; z-index: 2; }
    .brand { display: flex; align-items: center; gap: 14px; }
    .title { font-size: 56px; font-weight: 800; line-height: 1.04; margin: 0; letter-spacing: -0.02em; }
    .title span { color: #ff2a40; }
    .desc { font-size: 19px; line-height: 1.5; color: #9ca3af; margin: 0; }
    .pills { display: flex; flex-wrap: wrap; gap: 10px; }
    .pill { display: flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 999px; background: #171719; border: 1px solid #28282c; font-size: 14px; font-weight: 500; color: #ffffff; }
    .dot { width: 8px; height: 8px; border-radius: 50%; }
    .right { position: relative; width: 620px; height: 560px; }
    .desktop-preview { position: absolute; right: 0; top: 40px; width: 600px; border-radius: 16px; border: 2px solid #28282c; box-shadow: 0 30px 60px rgba(0,0,0,0.85); overflow: hidden; }
    .desktop-preview img { width: 100%; display: block; }
    .glow { position: absolute; right: 80px; top: 60px; width: 360px; height: 360px; border-radius: 50%; background: #ff2a40; opacity: 0.18; filter: blur(100px); pointer-events: none; }
  </style></head><body>
    <div class="hero">
      <div class="glow"></div>
      <div class="left">
        <div class="brand">
          <svg width="48" height="48" viewBox="0 0 30 30">
            <rect width="30" height="30" rx="9" fill="#ff2a40"/>
            <rect x="11.85" y="5" width="6.3" height="1.6" rx="0.5" fill="#ffffff"/>
            <rect x="14.59" y="7.4" width="0.82" height="9.8" fill="#ffffff"/>
            <rect x="8.9" y="18" width="12.2" height="1.6" rx="0.4" fill="#ffffff"/>
            <rect x="7.68" y="20.5" width="14.65" height="1.6" rx="0.4" fill="#ffffff"/>
            <rect x="6.05" y="23" width="17.9" height="1.6" rx="0.4" fill="#ffffff"/>
          </svg>
          <span style="font-size: 32px; font-weight: 800; letter-spacing: -0.02em;">body do</span>
        </div>
        <h1 class="title">Your workout planner, planned like a <span>pro.</span></h1>
        <p class="desc">A private, science-based workout planner & load calculator for the equipment you actually own. Pitch black theme, athletic red accents, and offline-ready.</p>
        <div class="pills">
          <div class="pill"><span class="dot" style="background:#ff2a40"></span>Load Calculator</div>
          <div class="pill"><span class="dot" style="background:#ff2a40"></span>Muscle Heat Map</div>
          <div class="pill"><span class="dot" style="background:#3dd6a8"></span>100% Offline PWA</div>
          <div class="pill"><span class="dot" style="background:#9ca3af"></span>No Tracking</div>
        </div>
      </div>
      <div class="right">
        <div class="desktop-preview">
          <img src="data:image/png;base64,${desktopBuffer.toString('base64')}" alt="Body Do Desktop View" />
        </div>
      </div>
    </div>
  </body></html>`;

  await heroPage.setContent(heroHtml);
  await heroPage.waitForTimeout(400);
  const heroPng = await heroPage.screenshot({ type: 'png' });
  await sharp(heroPng).png({ quality: 90, effort: 7 }).toFile(join(assets, 'hero-dark.png'));
  console.log('✓ Saved docs/assets/hero-dark.png');

  // Copy dark to light hero for graceful fallback
  await sharp(heroPng).png({ quality: 90, effort: 7 }).toFile(join(assets, 'hero-light.png'));
  console.log('✓ Saved docs/assets/hero-light.png');

  await browser.close();
  console.log('All screenshots captured and optimized successfully!');
}

run().catch((err) => {
  console.error('Error taking screenshots:', err);
  process.exit(1);
});
