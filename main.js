import { createApplication } from "./core/createApplication.js";

window.addEventListener("load", () => {

  requestAnimationFrame(async () => {

    const app = await createApplication();
    app.start();

  });

});
