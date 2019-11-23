import { Vue } from './vue-helper.js';
// import PkAsyncButton from 'src/components/pk-async-button.vue';

describe("general vue tests", function() {
  it("should call watch on changed data", function(done) {
    let spy = jasmine.createSpy('spy');

    let component = new Vue({
      template: '<div></div>',
      data: {
        somedata: false
      },
      watch: {
        somedata: function(new_val) {
          spy();
        }
      }
    }).$mount();

    expect(spy).not.toHaveBeenCalled();
    component.somedata = true;
    expect(spy).not.toHaveBeenCalled();

    component.$nextTick(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it("should call watch on changed data (with function)", function(done) {
    let spy = jasmine.createSpy('spy');

    let component = new Vue({
      template: '<div></div>',
      data: function() {
        return {
          somedata: false
        };
      },
      watch: {
        somedata: function(new_val) {
          spy();
        }
      }
    }).$mount();

    expect(spy).not.toHaveBeenCalled();
    component.somedata = true;
    expect(spy).not.toHaveBeenCalled();

    component.$nextTick(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });


  it("should call watch on changed prop", function(done) {
    let spy = jasmine.createSpy('spy');
    let spy2 = jasmine.createSpy('spy2');

    let root = new Vue({
      template: '<bababa :someprop="somedata"></bababa>',
      data: {
        somedata: "asdf"
      },
      components: {
        bababa: {
          template: '<div></div>',
          props: ['someprop'],
          watch: {
            someprop: function(new_val) {
              spy();
            }
          }
        }
      },
      watch: {
        somedata: function() {
          spy2();
        }
      }
    }).$mount();

    expect(spy).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    root.somedata = "zxcv";
    expect(spy).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();

    root.$nextTick(() => {
      expect(spy2).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });
  it("should call watch on changed prop without parent", function(done) {
    let spy = jasmine.createSpy('spy');

    let component = new Vue({
      template: '<div></div>',
      props: ['somedata'],
      propsData: {
        somedata: "asdf"
      },
      watch: {
        somedata: function(new_val) {
          spy();
        }
      }
    }).$mount();

    expect(spy).not.toHaveBeenCalled();
    component.somedata = true;
    expect(spy).not.toHaveBeenCalled();

    component.$nextTick(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });
  it("should have prop before data", function() {
    let component = new Vue({
      template: '<div></div>',
      props: ['someprop'],
      propsData: {
        someprop: "asdf"
      },
      data: function() {
        return {
          somedata: this.someprop
        };
      }
    }).$mount();

    expect(component.somedata).toEqual("asdf");
  });
});

describe("async-button tests", function() {

});
