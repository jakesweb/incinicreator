<template>
  <div class="help">
    <h1>Frequently Asked Questions</h1>
    <br />
    <p class="question">What is web monetization?</p>
    <br />
    <p class="answer">
      Web monetization are very small payments (micropayments) that are taken from users that visit
      web pages. These can be used to unlock premium content or web sites. For more information
      check out the <a href="https://webmonetization.org">webmonetization.org</a>
    </p>
    <br />
    <p class="question">What is a web monetization wallet</p>
    <br />
    <p class="answer">
      Web monetization wallets allow for the users to collect money from web monetization providers,
      like <a href="https://www.coilcom">Coil</a>. To setup a wallet, try some of these:
      <a href="https://gatehub.net" class="wallet">Gatehub</a>
      <a href="https://uphold.com" class="wallet">Uphold</a>
      <a href="https://stronghold.co" class="wallet">Stronghold</a>
      Once you have recieved your payment pointer you can enter it into your web site configuration
      to collect payments.
    </p>
  </div>
</template>

<style scoped>
.help {
  width: 80%;
  text-align: center;
  margin: 0 auto;
}
h1 {
  font-size: 3em;
  font-weight: 600;
}
.question {
  font-weight: 600;
  font-size: 2em;
}
.wallet {
  display: block;
  font-size: 1.3em;
}
</style>
