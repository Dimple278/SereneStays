class GlobalState {
  private state: ISTATE;
  private static instance: GlobalState;

  constructor() {
    this.state = {};
  }

  public setState() {}

  public static getInstance() {
    if (!this.instance) {
      return new GlobalState();
    }
    return this.instance;
  }
}

const GLOBAL_STATE = {
  timer: "2000",
};

// dependency injection =>

//     router class method (thiss.contrller: Controller) {

//         this.controller.method()
//         new ControllerClass().methodCall()
//     }

// singleton pattern
