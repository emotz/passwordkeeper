describe('main', function() {
  browser.windowHandleSize({ width: 1920, height: 1080 });

  const USER = 'myuseruser';
  const PASS = 'mypassmypass';
  const EMAIL = 'myemail@myemail.ru';

  const uniqueUser = (function() {
    let counter = 1;

    return () => `${USER}${counter++}`;
  })();

  const uniqueEmail = () => `${uniqueUser()}@myemail.ru`;

  describe('login', function() {
    const Page = require('./pageobjects/page.js');
    const page = new Page();

    beforeEach(function() {
      page.open();
    });

    it('should fail login with non-existent user/password', function() {
      page.login('nonexistent user', 'nonexistent password');
      page.waitForFailedLogin();
    });
    it('should fail signup with email without @', function() {
      page.signup(USER, PASS, 'notreally_an_email');
      page.waitForFailedSignup();
      page.hideModal();
    });
    it('should fail signup with username with @', function() {
      page.signup(USER + '@gmail.com', PASS, EMAIL);
      page.waitForFailedSignup();
      page.hideModal();
    });
    it('should signup, autologin and then logout', function() {
      page.signup(USER, PASS, EMAIL);
      page.waitForSuccessSignup();
      page.waitForSuccessLogin();
      page.logout();
      page.waitForSuccessLogout();
    });
    it('should login and logout', function() {
      page.login(USER, PASS);
      page.waitForSuccessLogin();
      page.logout();
      page.waitForSuccessLogout();
    });
    it('should login with email and logout', function() {
      page.login(EMAIL, PASS);
      page.waitForSuccessLogin();
      page.logout();
      page.waitForSuccessLogout();
    });
  });
  describe('about', function() {
    const page = require('./pageobjects/about.js');

    it('should contain app title', function() {
      page.open();

      expect(page.body.getText()).toContain("Password Keeper");
    });
  });
  describe('config', function() {
    const page = require('./pageobjects/config.js');

    it('can switch locale', function() {
      page.open();
      page.waitForEnglishLocale();

      page.selectLocale("ru");
      page.waitForRussianLocale();
      page.selectLocale("en");

      page.waitForEnglishLocale();
    });
  });

  describe('home', function() {
    const page = require('./pageobjects/home.js');

    describe('logged in user', function() {
      beforeEach(function() {
        page.open();
        page.login(USER, PASS);
        page.waitForSuccessLogin();
        page.removeAllPasses();
        page.waitForNoPasses();
      });

      afterEach(function() {
        page.waitForNoPasses();
        page.logout();
        page.waitForSuccessLogout();
      });

      it('can add and remove pass', function() {
        let pass = {
          title: 'test title',
          user: 'test user',
          password: 'test password'
        };

        page.addPass(pass);
        page.waitForPass(pass);
        page.removeLastPass();
        page.waitForPass(pass, undefined, true);
      });
      it('can add and remove pass with refresh', function() {
        let pass = {
          title: 'test title',
          user: 'test user',
          password: 'test password'
        };

        page.addPass(pass);
        page.waitForPass(pass);
        page.removeLastPass();
        page.waitForPass(pass, undefined, true);

        page.refreshAllPasses();
        page.waitForPass(pass, undefined, true);
      });
      it('bug with delete', function() {
        let pass1 = {
          title: 'first title',
          user: 'first user',
          password: 'first password'
        };
        let pass2 = {
          title: 'second title',
          user: 'second user',
          password: 'second password'
        };

        page.addPass(pass1);
        page.addPass(pass2);
        page.waitForPass(pass1);
        page.removePass(pass1);
        page.refreshAllPasses();
        page.waitForPass(pass1, undefined, true);
        page.waitForPass(pass2);
        page.removeLastPass();
      });
      it('can edit', function() {
        let pass = {
          title: 'test title',
          user: 'test user',
          password: 'test password'
        };

        let updatedPass = {
          title: 'updated title',
          user: 'updated user',
          password: 'updated password'
        };

        page.addPass(pass);
        page.editLastPass(updatedPass);
        page.waitForPass(updatedPass);
        page.waitForPass(pass, undefined, true);
        page.removeLastPass();
      });
      it('can search', function() {
        let pass = {
          title: 'test title',
          user: 'test user',
          password: 'test password'
        };
        let passing_query = "tit";
        let failing_query = "lalala";

        page.addPass(pass);
        page.searchPass(passing_query);
        page.waitForPass(pass);
        page.searchPass(failing_query);
        page.waitForNoPasses();
        page.searchPass("");
        page.waitForPass(pass);
        page.removeLastPass();
      });
    });

    describe('guest user', function() {
      beforeEach(function() {
        page.open();
      });

      it('should keep passwords after signup', function() {
        const pass = {
          title: 'test title',
          user: 'test user',
          password: 'test password'
        };

        page.addPass(pass);
        page.waitForPass(pass);

        page.signup(uniqueUser(), PASS, uniqueEmail());
        page.waitForSuccessSignup();
        page.waitForSuccessLogin();

        page.waitForPass(pass);

        page.removeAllPasses();
        page.waitForNoPasses();

        page.logout();
        page.waitForSuccessLogout();

        page.removeAllPasses();
        page.waitForNoPasses();
      });
    });
  });
});
