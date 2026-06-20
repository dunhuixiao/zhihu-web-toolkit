export function createZhihuFixture(): void {
  document.body.innerHTML = `
    <div id="root">
      <div class="css-s8xum0" style="position: fixed; top: 0;">
        <header class="AppHeader">
          <a class="AppHeader-logo" href="https://www.zhihu.com/" aria-label="知乎">知乎</a>
          <a href="https://www.zhihu.com/follow">关注</a>
          <a href="https://www.zhihu.com/">推荐</a>
          <a href="https://www.zhihu.com/hot">热榜</a>
          <form class="SearchBar"><input placeholder="搜索知乎内容" /></form>
          <button class="Button AppHeader-messages" type="button" aria-label="消息">
            <span>消息</span>
          </button>
          <button class="Button AppHeader-inbox" type="button" aria-label="私信">
            <span>私信</span>
          </button>
          <button class="Button AppHeader-profileEntry AppHeader-profile" type="button" aria-label="个人信息">
            <img class="Avatar AppHeader-profileAvatar" src="https://picx.zhimg.com/test-avatar.jpg" alt="点击打开用户的主页" />
          </button>
          <div class="css-ruapjk"></div>
          <a href="https://www.zhihu.com/question">提问</a>
        </header>
      </div>
      <main>
        <div class="Card CreatorEntrance GlobalSideBar-creator CreatorEntrance-link CreatorEntrance-Link--smallIcon">creator</div>
        <div class="KfeCollection-CreateSaltCard">salt</div>
        <div class="css-ga65ow">ga65ow</div>
        <div class="css-1qyytj7">qyytj7</div>
        <div class="css-1g41cri">1g41cri</div>
        <div class="Card css-173vipd">vip</div>
        <div class="Card TopstoryItem TopstoryItem--advertCard TopstoryItem-isRecommend">
          <div class="Pc-feedAd-new">
            <a target="_blank" href="https://www.example.com/ad">
              <div class="Pc-feedAd-new-title">豆包让小白也能玩转 AI 漫画图片生成</div>
              <div class="Pc-feedAd-new-card">
                <div class="Pc-feedAd-new-card-tag">广告</div>
                <div class="AdvertImg AdvertImg--isLoaded Pc-feedAd-new-card-image"></div>
                <div class="Pc-feedAd-new-card-content">
                  <span>豆包让小白也能玩转 AI 漫画图片生成</span>
                  <span class="Pc-feedAd-new-card-content-cta">查看详情</span>
                </div>
              </div>
            </a>
          </div>
        </div>
        <footer>footer</footer>
        <div class="WriteArea Card css-1x8qqvf">write</div>
      </main>
    </div>
    <button class="CornerButton" aria-label="回到顶部">回到顶部</button>
  `;
}
