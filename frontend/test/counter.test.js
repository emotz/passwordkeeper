import { Counter } from 'src/counter';

describe("counter tests", function() {
  it("should enable and disable", function() {
    const onEnable = jasmine.createSpy('onEnable');
    const onDisable = jasmine.createSpy('onDisable');
    const counter = new Counter({ onEnable, onDisable });

    counter.enable();
    expect(onEnable).toHaveBeenCalledTimes(1);
    expect(onDisable).not.toHaveBeenCalled();
    counter.disable();
    expect(onDisable).toHaveBeenCalledTimes(1);
  });

  it("should enable several times", function() {
    const onEnable = jasmine.createSpy('onEnable');
    const onDisable = jasmine.createSpy('onDisable');
    const counter = new Counter({ onEnable, onDisable });

    counter.enable();
    counter.enable();
    expect(onEnable).toHaveBeenCalledTimes(1);
    counter.disable();
    expect(onDisable).not.toHaveBeenCalled();
    counter.disable();
    expect(onDisable).toHaveBeenCalledTimes(1);
  });

  it("should chain enable and disable", function() {
    const onEnable = jasmine.createSpy('onEnable');
    const onDisable = jasmine.createSpy('onDisable');
    const counter = new Counter({ onEnable, onDisable });

    counter.enable();
    counter.enable();
    expect(onEnable).toHaveBeenCalledTimes(1);
    counter.disable();
    expect(onDisable).not.toHaveBeenCalled();
    counter.disable();
    expect(onDisable).toHaveBeenCalledTimes(1);

    counter.enable();
    expect(onEnable).toHaveBeenCalledTimes(2);
    counter.disable();
    expect(onDisable).toHaveBeenCalledTimes(2);
  });
});
