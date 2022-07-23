// // create a custom project Type
// enum ProjectStatus { Active, Finished }
// class Project {
//     constructor(
//         public id: number,
//         public title: string,
//         public description: string,
//         public people: number,
//         public status: ProjectStatus
//     ) { }
// }

// // create a custom listener function  type
// type Listener = (items: Project[]) => void;

// // create a class fro application state
// class AppState {
//     private listeners: Listener[] = [];
//     private projects: Project[] = [];
//     private static instance: AppState;

//     private constructor() {

//     }

//     static getInstance() {
//         if (this.instance) {
//             return this.instance;
//         }
//         this.instance = new AppState()
//         return this.instance;
//     }

//     // method to generate a unique id
//     generateUniqueId = (length: number) => {
//         return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(length).toString().replace(".", ""))
//     }

//     addListener(fn: Listener) {
//         this.listeners.push(fn);
//     }

//     addProject(title: string, description: string, people: number) {

//         const newProject = new Project(this.generateUniqueId(16), title, description, people, ProjectStatus.Active)
//         // push the newly created project to the projects array
//         this.projects.push(newProject);

//         // call registered listener functions
//         for (const listenerFn of this.listeners) {
//             // call each fn with a shallow copy of projects array
//             listenerFn(this.projects.slice())
//         }
//     }
// }

// const appState = AppState.getInstance();

// // create a reusable validator function
// interface Validatable {
//     value: string | number;
//     required?: boolean;
//     minLength?: number;
//     maxLength?: number;
//     min?: number;
//     max?: number;
// }
// function validate(validatableInput: Validatable) {
//     let isValid = true;
//     if (validatableInput.required) {
//         isValid = isValid && validatableInput.value.toString().trim().length !== 0;
//     }
//     if (
//         validatableInput.minLength != null &&
//         typeof validatableInput.value === 'string'
//     ) {
//         isValid =
//             isValid && validatableInput.value.length >= validatableInput.minLength;
//     }
//     if (
//         validatableInput.maxLength != null &&
//         typeof validatableInput.value === 'string'
//     ) {
//         isValid =
//             isValid && validatableInput.value.length <= validatableInput.maxLength;
//     }
//     if (
//         validatableInput.min != null &&
//         typeof validatableInput.value === 'number'
//     ) {
//         isValid = isValid && validatableInput.value >= validatableInput.min;
//     }
//     if (
//         validatableInput.max != null &&
//         typeof validatableInput.value === 'number'
//     ) {
//         isValid = isValid && validatableInput.value <= validatableInput.max;
//     }
//     return isValid;
// }

// // create a reusable autoBinder decorator
// function AutoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
//     const originalMethod = descriptor.value;
//     const adjustedDescriptor: PropertyDescriptor = {
//         configurable: true,
//         enumerable: false,
//         get() {
//             const boundFn = originalMethod.bind(this);
//             return boundFn;
//         }
//     }
//     return adjustedDescriptor;
// }

// // project list class
// class ProjectList {
//     templateEl: HTMLTemplateElement;
//     hostEl: HTMLDivElement;
//     element: HTMLElement;
//     assignedProjects: Project[];

//     constructor(private type: "active" | "finished") {
//         this.assignedProjects = [];
//         // select the template to append
//         this.templateEl = document.getElementById("project-list")! as HTMLTemplateElement;

//         // select the host element to append the template
//         this.hostEl = document.getElementById("app")! as HTMLDivElement;

//         // take a copy of the template content to be appended and extract the first element child
//         const importedNode = document.importNode(this.templateEl.content, true);
//         this.element = importedNode.firstElementChild as HTMLElement;

//         // add an id attribute to take advantage of pre-written css
//         this.element.id = `${this.type}-projects`;

//         // set up a listener
//         appState.addListener((projects: Project[]) => {
//             const relevantProjects = projects.filter(p => {
//                 if (this.type === "active") {
//                     return p.status === ProjectStatus.Active;
//                 }
//                 return p.status === ProjectStatus.Finished;
//             })
//             this.assignedProjects = relevantProjects;
//             this.renderProjects();
//         })

//         this.attach();
//         this.renderContent();
//     }

//     private renderProjects() {
//         const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
//         // reset content before every rerender
//         listEl.innerText = '';
//         for (const projectItem of this.assignedProjects) {
//             const listItem = document.createElement("li");
//             listItem.textContent = projectItem.title;
//             listEl.appendChild(listItem);
//         }
//     }

//     private renderContent() {
//         // assign an id to ul to reference later
//         const listId = `${this.type}-projects-list`;
//         this.element.querySelector("ul")!.id = listId;

//         // populate h2 element
//         this.element.querySelector("h2")!.textContent = this.type.toUpperCase() + " PROJECTS"

//     }

//     private attach() {
//         // insert the template element to the host element in the beginning
//         this.hostEl.insertAdjacentElement("beforeend", this.element)
//     }
// }

// // project input class
// class ProjectInput {
//     templateEl: HTMLTemplateElement;
//     hostEl: HTMLDivElement;
//     element: HTMLFormElement;
//     titleEl: HTMLInputElement;
//     descriptionEl: HTMLInputElement;
//     peopleEl: HTMLInputElement;

//     constructor() {
//         // select the template to append
//         this.templateEl = document.getElementById("project-input")! as HTMLTemplateElement;

//         // select the host element to append the template
//         this.hostEl = document.getElementById("app")! as HTMLDivElement;

//         // take a copy of the template content to be appended and extract the first element child
//         const importedNode = document.importNode(this.templateEl.content, true);
//         this.element = importedNode.firstElementChild as HTMLFormElement;

//         // add an id attribute to take advantage of pre-written css
//         this.element.id = "user-input"

//         // reach out the input elements
//         this.titleEl = this.element.querySelector("#title") as HTMLInputElement;
//         this.descriptionEl = this.element.querySelector("#description") as HTMLInputElement;
//         this.peopleEl = this.element.querySelector("#people") as HTMLInputElement;

//         // call the attach method to invoke right away
//         this.configure();
//         this.attach();
//     }

//     // collect and validate user data
//     private collectUSerData(): [string, string, number] | void {
//         const title = this.titleEl.value;
//         const description = this.descriptionEl.value;
//         const people = this.peopleEl.value;

//         // create objects for validation and validate
//         const titleValidatable: Validatable = {
//             value: title,
//             required: true
//         };
//         const descriptionValidatable: Validatable = {
//             value: description,
//             required: true,
//             minLength: 5
//         };
//         const peopleValidatable: Validatable = {
//             value: +people,
//             required: true,
//             min: 1,
//             max: 5
//         };
//         if (
//             !validate(titleValidatable) ||
//             !validate(descriptionValidatable) ||
//             !validate(peopleValidatable)
//         ) {
//             alert("Invalid input!")
//             return;
//         } else {
//             return [title, description, +people]
//         }
//     }

//     // clear inputs after submit
//     private clearInputs() {
//         this.titleEl.value = "";
//         this.descriptionEl.value = "";
//         this.peopleEl.value = "";
//     }

//     // auto bind submit handler for event listener
//     @AutoBind
//     private submitHandler(e: Event) {
//         e.preventDefault()
//         const userData = this.collectUSerData();
//         if (Array.isArray(userData)) {
//             const [title, description, people] = userData;
//             // add the user data to the app state
//             appState.addProject(title, description, people)

//             // clear user input fields
//             this.clearInputs();
//         }
//     }

//     private configure() {
//         this.element.addEventListener("submit", this.submitHandler)
//     }

//     private attach() {
//         // insert the template element to the host element in the beginning
//         this.hostEl.insertAdjacentElement("afterbegin", this.element)
//     }
// }

// const projectInput = new ProjectInput();
// const activeProjectList = new ProjectList("active");
// const finishedProjectList = new ProjectList("finished");