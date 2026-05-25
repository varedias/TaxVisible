import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildDiscoveryVideoDetail,
  discoveryVideos,
  getDiscoveryVideos,
} from './discoveryVideos.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const expectedTopTitles = [
  '基于视觉的智能分拣机市场——全球预测2026-2032',
  '民崛智能分拣现场实拍：高速识别与自动分流演示',
  '民崛智能方案纪实：复杂来料下的视觉分拣稳定性验证',
];

test('discovery 推荐列表最前面保留三条新增补充内容', () => {
  assert.deepEqual(
    discoveryVideos.slice(0, 3).map((item) => item.title),
    expectedTopTitles,
  );
});

test('discovery 文案补充内容可以生成文章详情结构', () => {
  const article = discoveryVideos[0];
  const detail = buildDiscoveryVideoDetail(article.id);
  const expectedSectionTitles = [
    '为何基于视觉的智能分拣机正成为质量、收益和弹性自动化战略的关键运营基础设施',
    '人工智能感知、边缘计算以及以可持续发展为导向的采购如何重塑从设备采购到平台的智能排序',
    '2025年美国关税如何重塑采购、生命周期服务重点以及用于分拣自动化的风险管理采购',
    '关于用例契合、传感器和操作选择的细分揭示了哪些内容,以及软件治理为何会逐步定义其排序性能',
    '区域运营现实——从监管到劳动力和基础设施——如何塑造智能分拣的采用路径和绩效预期',
    '实可行的领导措施,以降低智能分拣投资风险,加强数据治理,并构建可扩展的多站点自动化能力',
    '一种将初级行业参与与多源验证相结合的严谨方法,将技术能力与采购与部署现实相结合',
    '战略要点:目前,卓越排序依赖于持续的人工智能生命周期、具有韧性的采购能力以及安装之外的运营一致性',
  ];

  assert.equal(detail.type, 'article');
  assert.equal(detail.title, '基于视觉的智能分拣机市场——全球预测2026-2032');
  assert.ok(detail.description);
  assert.equal(
    detail.description,
    '基于视觉的智能分拣机市场从2025年的23.8亿美元增长到2026年的26.7亿美元。预计其复合年增长率将保持在13.20%,到2032年达到56.8亿美元。',
  );
  assert.ok(Array.isArray(detail.sections));
  assert.deepEqual(detail.sections.map((section) => section.title), expectedSectionTitles);
  assert.ok(
    detail.sections[0].paragraphs.includes(
      '基于视觉的智能分拣机位于自动化、质量保证和资源效率的交汇点。它们结合成像硬件、照明设计和人工智能驱动的分类,以工业速度识别、分级和传输路线,替代或增强人工检测以及传统的仅传感器分拣。随着劳动力市场收紧和质量标准不断提高,这些系统越来越被视为非可选附加组件,而是作为核心生产基础设施,通过提高产量、减少污染和更稳定的吞吐量来保护利润率。',
    ),
  );
  assert.ok(Array.isArray(detail.articlePages));
  assert.ok(detail.articlePages.length >= 3);
});

test('discovery 全部内容综合排序时新增三条内容固定在前三位', () => {
  assert.deepEqual(
    getDiscoveryVideos({ activeCategory: 'all', sortBy: 'hot' }).slice(0, 3).map((item) => item.id),
    [25, 24, 23],
  );
});

test('discovery 本地视频资源存在于 public 目录', () => {
  const localVideoUrls = discoveryVideos
    .map((item) => item.videoUrl)
    .filter((videoUrl) => typeof videoUrl === 'string' && videoUrl.startsWith('/'));

  assert.ok(localVideoUrls.length > 0, 'expected at least one local discovery video URL');

  for (const videoUrl of localVideoUrls) {
    const assetPath = path.join(projectRoot, 'public', videoUrl.replace(/^\//, ''));
    assert.ok(fs.existsSync(assetPath), `${videoUrl} must exist in frontend/public`);
    assert.ok(fs.statSync(assetPath).size > 0, `${videoUrl} must not be empty`);
  }
});
