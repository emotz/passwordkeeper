describe('karma', function() {
  it('karma', function() {
    browser.url('/');
    browser.waitForVisible('//h1[contains(., "disconnected")]', 60000);
  });
});
