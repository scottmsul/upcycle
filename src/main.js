import { initialize_ui } from './ui/initialize.js';
import { display_solver_input } from './ui/displaySolverInput.js';
import { Controller } from './controller.js';

initialize_ui();
let controller = new Controller();
display_solver_input(controller.solver_input);
