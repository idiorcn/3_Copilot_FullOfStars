Page({
  data: {
      playerFunds: 5000000,
      computerFunds: [5000000],
      playerStocks: 0,
      stockPrice: 100,
      priceHistory: [100],
      level: 1,
      challengeAttempts: 3,
      nextRecoveryTime: new Date(),
      levelGoals: [10000, 1000000],
      additionalComputersVisible: false,
      stockAmount: 100
  },

  onLoad() {
      this.updatePrice();
      setInterval(() => {
          this.updatePrice();
          this.computerTrade();
      }, 1000);
      this.updateRecoveryTime();
  },

  updatePrice() {
      const change = (Math.random() - 0.5) * 10;
      let stockPrice = Math.max(1, this.data.stockPrice + change);
      let priceHistory = this.data.priceHistory;
      priceHistory.push(stockPrice);
      if (priceHistory.length > 100) {
          priceHistory.shift();
      }
      this.setData({ stockPrice, priceHistory });
      this.drawChart();
      this.updatePlayerStockValue();
  },

  drawChart() {
      const priceHistory = this.data.priceHistory;
      const maxPrice = Math.max(...priceHistory);
      const minPrice = Math.min(...priceHistory);
      const ctx = wx.createCanvasContext('price-chart');
      ctx.beginPath();
      ctx.moveTo(0, 300 - ((priceHistory[0] - minPrice) / (maxPrice - minPrice)) * 300);
      priceHistory.forEach((price, index) => {
          const x = (index / (priceHistory.length - 1)) * 300;
          const y = 300 - ((price - minPrice) / (maxPrice - minPrice)) * 300;
          ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#4caf50';
      ctx.stroke();
      ctx.draw();
      this.drawScales(minPrice, maxPrice);
  },

  drawScales(minPrice, maxPrice) {
      const priceScale = [];
      const percentageScale = [];
      for (let i = 0; i <= 10; i++) {
          const price = minPrice + (i * (maxPrice - minPrice)) / 10;
          const percentage = ((price - this.data.stockPrice) / this.data.stockPrice) * 100;
          priceScale.unshift(price.toFixed(2));
          percentageScale.unshift(percentage.toFixed(2) + '%');
      }
      this.setData({ priceScale, percentageScale });
  },

  computerTrade() {
      let computerFunds = this.data.computerFunds;
      computerFunds.forEach((funds, index) => {
          const action = Math.random() > 0.5 ? 'buy' : 'sell';
          const amount = Math.floor(Math.random() * 1000);
          if (action === 'buy' && funds >= this.data.stockPrice * amount) {
              computerFunds[index] -= this.data.stockPrice * amount;
          } else if (action === 'sell' && funds + this.data.stockPrice * amount <= 5000000) {
              computerFunds[index] += this.data.stockPrice * amount;
          }
      });
      this.setData({ computerFunds });
  },

  playerTrade(e) {
      const action = e.currentTarget.dataset.action;
      const amount = parseInt(this.data.stockAmount);
      let playerFunds = this.data.playerFunds;
      let playerStocks = this.data.playerStocks;
      if (action === 'buy' && playerFunds >= this.data.stockPrice * amount) {
          playerFunds -= this.data.stockPrice * amount;
          playerStocks += amount;
      } else if (action === 'sell' && playerStocks >= amount) {
          playerFunds += this.data.stockPrice * amount;
          playerStocks -= amount;
      }
      this.setData({ playerFunds, playerStocks });
      this.updatePlayerStockValue();
      this.checkGameOver();
  },

  updatePlayerStockValue() {
      const stockValue = this.data.playerStocks * this.data.stockPrice;
      const profit = stockValue + this.data.playerFunds - 5000000;
      const profitRate = (profit / 5000000) * 100;
      this.setData({
          playerStockValue: stockValue,
          playerProfit: profit.toFixed(2),
          playerProfitRate: profitRate.toFixed(2) + '%'
      });
  },

  checkGameOver() {
      const totalValue = this.data.playerFunds + this.data.playerStocks * this.data.stockPrice;
      if (totalValue < 10000) {
          wx.showToast({ title: '电脑赢了！', icon: 'none' });
          this.setData({ challengeAttempts: this.data.challengeAttempts - 1 });
          if (this.data.challengeAttempts === 0) {
              this.setData({ nextRecoveryTime: new Date(Date.now() + 4 * 60 * 60 * 1000) });
              this.updateRecoveryTime();
          }
          this.resetGame();
      } else if (this.data.computerFunds.some(funds => funds < 10000)) {
          wx.showToast({ title: '玩家赢了！', icon: 'none' });
          this.resetGame();
      } else if (totalValue >= 5000000 + this.data.levelGoals[this.data.level - 1]) {
          wx.showToast({ title: '玩家完成了当前关卡！', icon: 'none' });
          this.nextLevel();
      }
  },

  nextLevel() {
      if (this.data.level === 1) {
          this.setData({
              level: 2,
              computerFunds: [5000000, 5000000, 5000000, 5000000, 5000000],
              additionalComputersVisible: true
          });
          this.resetGame();
      }
  },

  resetGame() {
      this.setData({
          playerFunds: 5000000,
          computerFunds: this.data.computerFunds.map(() => 5000000),
          playerStocks: 0,
          stockPrice: 100,
          priceHistory: [100],
          playerStockValue: 0,
          playerProfit: 0,
          playerProfitRate: '0%'
      });
      this.drawChart();
  },

  updateRecoveryTime() {
      const now = new Date();
      const timeDiff = this.data.nextRecoveryTime - now;
      if (timeDiff > 0) {
          const hours = Math.floor(timeDiff / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
          this.setData({ nextRecoveryTimeText: `${hours}:${minutes}:${seconds}` });
          setTimeout(this.updateRecoveryTime, 1000);
      } else {
          this.setData({
              challengeAttempts: this.data.challengeAttempts + 1,
              nextRecoveryTimeText: '--:--:--'
          });
      }
  },

  watchAd() {
      wx.showToast({ title: '观看30秒广告以增加一次挑战机会', icon: 'none' });
      setTimeout(() => {
          this.setData({ challengeAttempts: this.data.challengeAttempts + 1 });
      }, 30000);
  },

  followGongzhonghao() {
      wx.showToast({ title: '关注GrandMiracle公众号以增加一次挑战机会', icon: 'none' });
      this.setData({ challengeAttempts: this.data.challengeAttempts + 1 });
  },

  inviteFriend() {
      wx.showToast({ title: '邀请好友关注GrandMiracle公众号以增加一次挑战机会', icon: 'none' });
      this.setData({ challengeAttempts: this.data.challengeAttempts + 1 });
  },

  updateStockAmount(e) {
      this.setData({ stockAmount: e.detail.value });
  }
});
