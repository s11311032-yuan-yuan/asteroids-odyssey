export const TRANSLATIONS = {
  'zh-TW': {
    ui: {
      score: 'SCORE',
      hiscore: 'HI-SCORE',
      lives: 'LIVES',
      level: 'LEVEL',
      cooldown: 'FIRE CD',
      objective: 'OBJECTIVE',
      bossHp: '利維坦晶體核心',
      gameOver: 'GAME OVER',
      victory: 'MISSION ACCOMPLISHED',
      victoryDesc: '你成功摧毀了利維坦核心，清除了深空威脅，拯救了探險艦隊！',
      restartHint: '按下 空白鍵 或 點擊重新開始',
      nextLevel: '下一關',
      continue: '繼續',
      skip: '略過對話',
      controlsHint: '方向鍵 / WASD 移動・空白鍵射擊・滑鼠瞄準與點擊發射',
      stageClear: '關卡突破！',
      stageClearDesc: '航道清理完畢，準備躍遷進入下一星區。',
      soundOn: '音效：開啟',
      soundOff: '音效：靜音'
    },
    characters: {
      commander: '伊芙琳 指揮官',
      ai: '戰術AI NAV-7'
    },
    levels: {
      1: {
        title: '第 1 章：柯伊伯外圍',
        objectiveText: '摧毀 12 個小行星碎片',
        targetCount: 12,
        dialog: [
          { speaker: 'commander', text: '探險者號，我們已抵達柯伊伯帶邊緣。前方航道被密集隕石阻擋，進行清除並測試火控系統！' },
          { speaker: 'ai', text: '艦載武器與雷達校準完成。請保持推進器平穩，避免高速撞擊大型岩塊。' }
        ]
      },
      2: {
        title: '第 2 章：電漿星雲',
        objectiveText: '摧毀 20 個小行星碎片',
        targetCount: 20,
        dialog: [
          { speaker: 'ai', text: '警告：星雲內部的高能電磁干擾正在加劇，小行星飛行速率提高 30%！' },
          { speaker: 'commander', text: '保持機動迴避！別讓高速碎片擊穿護盾，全速開火破開星雲！' }
        ]
      },
      3: {
        title: '第 3 章：引力亂流',
        objectiveText: '摧毀 26 個小行星碎片',
        targetCount: 26,
        dialog: [
          { speaker: 'ai', text: '偵測到前方空間出現異常引力漣漪，小行星群出現異常聚合現象。' },
          { speaker: 'commander', text: '我們正深入核心區域，這絕不是自然形成的隕石帶。全艦保持最高警戒！' }
        ]
      },
      4: {
        title: '第 4 章：異星水晶先鋒',
        objectiveText: '摧毀 32 個小行星碎片',
        targetCount: 32,
        dialog: [
          { speaker: 'commander', text: '注意！這些小行星表面覆蓋著未知共鳴晶體，具備極高硬度！' },
          { speaker: 'ai', text: '掃描顯示前方深處有巨大的脈衝生命體反應。預計即將接觸敵方母體！' }
        ]
      },
      5: {
        title: '第 5 章：利維坦母體核心',
        objectiveText: '擊毀 利維坦晶體核心 Boss',
        targetCount: 1,
        dialog: [
          { speaker: 'ai', text: '重大警報！「利維坦晶體核心」甦醒！偵測到旋轉防禦護盾與外星脈衝彈幕！' },
          { speaker: 'commander', text: '最後的決戰到了！探險者號，集中全部火力粉碎敵方核心，開闢生存之路！' }
        ]
      }
    }
  },
  'en': {
    ui: {
      score: 'SCORE',
      hiscore: 'HI-SCORE',
      lives: 'LIVES',
      level: 'LEVEL',
      cooldown: 'FIRE CD',
      objective: 'OBJECTIVE',
      bossHp: 'LEVIATHAN CORE',
      gameOver: 'GAME OVER',
      victory: 'MISSION ACCOMPLISHED',
      victoryDesc: 'You destroyed the Leviathan Core, neutralized the deep space threat, and saved the fleet!',
      restartHint: 'Press SPACE or Click to Restart',
      nextLevel: 'NEXT STAGE',
      continue: 'CONTINUE',
      skip: 'SKIP',
      controlsHint: 'Arrows / WASD to Move・SPACE to Fire・Mouse to Aim & Shoot',
      stageClear: 'SECTOR CLEARED!',
      stageClearDesc: 'Flight path secure. Priming hyperdrive for the next sector.',
      soundOn: 'SOUND: ON',
      soundOff: 'SOUND: MUTED'
    },
    characters: {
      commander: 'Cmdr. Evelyn',
      ai: 'Tactical AI NAV-7'
    },
    levels: {
      1: {
        title: 'Chapter 1: Kuiper Outskirts',
        objectiveText: 'Destroy 12 asteroid fragments',
        targetCount: 12,
        dialog: [
          { speaker: 'commander', text: 'Explorer-1, we have arrived at the Kuiper rim. Dense asteroids ahead—clear the route and test all weapon systems!' },
          { speaker: 'ai', text: 'Fire control online. Maintain smooth thrust vectors to avoid high-velocity collisions.' }
        ]
      },
      2: {
        title: 'Chapter 2: Plasma Nebula',
        objectiveText: 'Destroy 20 asteroid fragments',
        targetCount: 20,
        dialog: [
          { speaker: 'ai', text: 'Warning: Strong electromagnetic turbulence detected. Asteroid kinetic speeds increased by 30%!' },
          { speaker: 'commander', text: 'Stay alert and maintain maneuverability! Blast through the storm!' }
        ]
      },
      3: {
        title: 'Chapter 3: Gravity Anomaly',
        objectiveText: 'Destroy 26 asteroid fragments',
        targetCount: 26,
        dialog: [
          { speaker: 'ai', text: 'Abnormal gravitational ripples detected. Asteroid clusters are behaving erratically.' },
          { speaker: 'commander', text: 'We are closing in on the epicenter. This asteroid field is unnatural. Maximum battle readiness!' }
        ]
      },
      4: {
        title: 'Chapter 4: Crystal Vanguard',
        objectiveText: 'Destroy 32 asteroid fragments',
        targetCount: 32,
        dialog: [
          { speaker: 'commander', text: 'Look closely! These asteroids are infused with resonating alien crystals!' },
          { speaker: 'ai', text: 'Deep scanners identify a colossal organic-crystalline entity awakening just ahead!' }
        ]
      },
      5: {
        title: 'Chapter 5: The Leviathan Core',
        objectiveText: 'Eliminate the Leviathan Core Boss',
        targetCount: 1,
        dialog: [
          { speaker: 'ai', text: 'CRITICAL ALERT! The Leviathan Core has awakened! Active rotating shields and energy barrages detected!' },
          { speaker: 'commander', text: 'This is the final showdown! Focus all fire on the core and secure humanity\'s future!' }
        ]
      }
    }
  },
  'ja': {
    ui: {
      score: 'SCORE',
      hiscore: 'HI-SCORE',
      lives: 'LIVES',
      level: 'LEVEL',
      cooldown: 'FIRE CD',
      objective: 'OBJECTIVE',
      bossHp: 'リヴァイアサン・コア',
      gameOver: 'GAME OVER',
      victory: 'MISSION ACCOMPLISHED',
      victoryDesc: 'リヴァイアサン・コアを完全破壊し、深宇宙の脅威を退け、船団を救還した！',
      restartHint: 'SPACEキーまたはクリックで再開',
      nextLevel: '次のセクターへ',
      continue: '次へ',
      skip: 'スキップ',
      controlsHint: '方向キー/WASDで移動・スペースで射撃・マウスで照準＆射撃',
      stageClear: '作戦成功！',
      stageClearDesc: '航路の安全を確保。次の宙域へのワープ準備完了。',
      soundOn: 'サウンド：ON',
      soundOff: 'サウンド：OFF'
    },
    characters: {
      commander: 'エヴリン司令官',
      ai: '戦術AI NAV-7'
    },
    levels: {
      1: {
        title: '第1章：カイパーベルト周縁',
        objectiveText: '小惑星の破片を 12 個破壊せよ',
        targetCount: 12,
        dialog: [
          { speaker: 'commander', text: 'エクスプローラー号、カイパーベルトの外縁部に到達した。密集した小惑星を排除し、兵装をテストせよ！' },
          { speaker: 'ai', text: '火器管制システム正常。高速衝突を回避するため、推進ベクトルを安定させてください。' }
        ]
      },
      2: {
        title: '第2章：プラズマ星雲',
        objectiveText: '小惑星の破片を 20 個破壊せよ',
        targetCount: 20,
        dialog: [
          { speaker: 'ai', text: '警告：星雲内の高電磁干渉により、小惑星の移動速度が30％上昇しています！' },
          { speaker: 'commander', text: '機動性を維持せよ！破片の猛攻を回避し、火力を集中して突破口を開け！' }
        ]
      },
      3: {
        title: '第3章：重力異常帯',
        objectiveText: '小惑星の破片を 26 個破壊せよ',
        targetCount: 26,
        dialog: [
          { speaker: 'ai', text: '強力な重力異常波を感知。小惑星が異常な密度で集束しています。' },
          { speaker: 'commander', text: '震源に近づいている。これは自然現象ではない。全艦、最高度戦闘態勢！' }
        ]
      },
      4: {
        title: '第4章：水晶の前衛部隊',
        objectiveText: '小惑星の破片を 32 個破壊せよ',
        targetCount: 32,
        dialog: [
          { speaker: 'commander', text: '見ろ！小惑星の表面が共振する異星の結晶で硬化されている！' },
          { speaker: 'ai', text: '深部スキャン完了。最深部に眠る巨大結晶生命体の覚醒反応を確認！' }
        ]
      },
      5: {
        title: '第5章：リヴァイアサン・コア',
        objectiveText: '巨大小惑星リヴァイアサン・コアを撃破せよ',
        targetCount: 1,
        dialog: [
          { speaker: 'ai', text: '緊急事態発生！「リヴァイアサン・コア」が覚醒！旋回シールドとパルス弾幕を確認！' },
          { speaker: 'commander', text: 'これが最後の決戦だ！全火力をコアへ集中し、活路を切り拓け！' }
        ]
      }
    }
  },
  'zh-CN': {
    ui: {
      score: 'SCORE',
      hiscore: 'HI-SCORE',
      lives: 'LIVES',
      level: 'LEVEL',
      cooldown: 'FIRE CD',
      objective: 'OBJECTIVE',
      bossHp: '利维坦晶体核心',
      gameOver: 'GAME OVER',
      victory: 'MISSION ACCOMPLISHED',
      victoryDesc: '你成功摧毁了利维坦核心，清除了深空威胁，拯救了探险舰队！',
      restartHint: '按下 空格键 或 点击重新开始',
      nextLevel: '下一关',
      continue: '继续',
      skip: '跳过对话',
      controlsHint: '方向键 / WASD 移动・空格键射击・鼠标瞄准与点击发射',
      stageClear: '关卡突破！',
      stageClearDesc: '航道清理完毕，准备跃迁进入下一星区。',
      soundOn: '音效：开启',
      soundOff: '音效：静音'
    },
    characters: {
      commander: '伊芙琳 指挥官',
      ai: '战术AI NAV-7'
    },
    levels: {
      1: {
        title: '第 1 章：柯伊伯外围',
        objectiveText: '摧毁 12 个小行星碎片',
        targetCount: 12,
        dialog: [
          { speaker: 'commander', text: '探险者号，我们已抵达柯伊伯带边缘。前方航道被密集陨石阻挡，进行清除并测试火控系统！' },
          { speaker: 'ai', text: '舰载武器与雷达校准完成。请保持推进器平稳，避免高速撞击大型岩块。' }
        ]
      },
      2: {
        title: '第 2 章：等离子星云',
        objectiveText: '摧毁 20 个小行星碎片',
        targetCount: 20,
        dialog: [
          { speaker: 'ai', text: '警告：星云内部的高能电磁干扰正在加剧，小行星飞行速率提高 30%！' },
          { speaker: 'commander', text: '保持机动回避！别让高速碎片击穿护盾，全速开火破开星云！' }
        ]
      },
      3: {
        title: '第 3 章：引力乱流',
        objectiveText: '摧毁 26 个小行星碎片',
        targetCount: 26,
        dialog: [
          { speaker: 'ai', text: '侦测到前方空间出现异常引力涟漪，小行星群出现异常聚合现象。' },
          { speaker: 'commander', text: '我们正深入核心区域，这绝不是自然形成的陨石带。全舰保持最高警戒！' }
        ]
      },
      4: {
        title: '第 4 章：异星水晶先锋',
        objectiveText: '摧毁 32 个小行星碎片',
        targetCount: 32,
        dialog: [
          { speaker: 'commander', text: '注意！这些小行星表面覆盖着未知共鸣晶体，具备极高硬度！' },
          { speaker: 'ai', text: '扫描显示前方深处有巨大的脉冲生命体反应。预计即将接触敌方母体！' }
        ]
      },
      5: {
        title: '第 5 章：利维坦母体核心',
        objectiveText: '击毁 利维坦晶体核心 Boss',
        targetCount: 1,
        dialog: [
          { speaker: 'ai', text: '重大警报！“利维坦晶体核心”苏醒！侦测到旋转防御护盾与外星脉冲弹幕！' },
          { speaker: 'commander', text: '最后的决战到了！探险者号，集中全部火力粉碎敌方核心，开辟生存之路！' }
        ]
      }
    }
  }
};
