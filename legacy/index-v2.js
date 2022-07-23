// // create interfaces for drag/drop events
// interface Draggable {
//     handleDragStart(event: DragEvent): void;
//     handleDragEnd(event: DragEvent): void;
// };

// interface DragTarget {
//     handleDragOver(event: DragEvent): void;
//     handleDrop(event: DragEvent): void;
//     handleDragLeave(event: DragEvent): void;
// }

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
// type Listener<T> = (items: T[]) => void;

// // create an inheritable base class for app State
// class State<T> {
//     protected listeners: Listener<T>[] = [];

//     addListener(fn: Listener<T>) {
//         this.listeners.push(fn);
//     }
// }

// // create a class fro application state
// class ProjectState extends State<Project> {
//     private projects: Project[] = [];
//     private static instance: ProjectState;

//     private constructor() {
//         super()
//     }

//     static getInstance() {
//         if (this.instance) {
//             return this.instance;
//         }
//         this.instance = new ProjectState()
//         return this.instance;
//     }

//     // method to generate a unique id
//     generateUniqueId = (length: number) => {
//         return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(length).toString().replace(".", ""))
//     }

//     addProject(title: string, description: string, people: number) {
//         const newProject = new Project(this.generateUniqueId(16), title, description, people, ProjectStatus.Active)
//         // push the newly created project to the projects array
//         this.projects.push(newProject);
//         this.updateListeners();
//     }

//     moveProject(projectId: number, newStatus: ProjectStatus) {
//         const project = this.projects.find(el => el.id === projectId);
//         if (project && project.status !== newStatus) {
//             project.status = newStatus;
//             this.updateListeners();
//         }
//     }

//     updateListeners() {
//         // call registered listener functions
//         for (const listenerFn of this.listeners) {
//             // call each fn with a shallow copy of projects array
//             listenerFn(this.projects.slice())
//         }
//     }
// }
// const projectState = ProjectState.getInstance();

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

// // create an inheritable base Component class
// abstract class Component<T extends HTMLElement, U extends HTMLElement> {
//     templateEl: HTMLTemplateElement;
//     hostEl: T;
//     element: U;

//     constructor(templateId: string, hostElementId: string, insertAtStart: boolean, newElementId?: string) {
//         // select the template to append
//         this.templateEl = document.getElementById(templateId)! as HTMLTemplateElement;

//         // select the host element to append the template
//         this.hostEl = document.getElementById(hostElementId)! as T;

//         // take a copy of the template content to be appended and extract the first element child
//         const importedNode = document.importNode(this.templateEl.content, true);
//         this.element = importedNode.firstElementChild as U;

//         // add an id attribute to take advantage of pre-written css
//         if (newElementId) {
//             // this.element.id = `${this.type}-projects`;
//             this.element.id = newElementId;
//         }

//         this.attach(insertAtStart);
//     }

//     private attach(insertAtBegin: boolean) {
//         // insert the template element to the host element in the beginning
//         this.hostEl.insertAdjacentElement(
//             insertAtBegin ? "afterbegin" : "beforeend",
//             this.element)
//     }

//     abstract configure(): void;
//     abstract renderContent(): void;
// }

// // project item class extending Component
// class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
//     private project: Project;

//     get persons() {
//         if (this.project.people === 1) {
//             return "1 person";
//         }
//         return `${this.project.people} people`;
//     }

//     constructor(hostId: string, project: Project) {
//         super("single-project", hostId, false, project.id.toString())
//         this.project = project
//         this.configure();
//         this.renderContent()
//     }

//     @AutoBind
//     handleDragStart(event: DragEvent): void {
//         event.dataTransfer!.setData('text/plain', this.project.id.toString())
//         event.dataTransfer!.effectAllowed = 'move';
//     }

//     handleDragEnd(_: DragEvent): void {
//         console.log("drag end")
//     }

//     configure() {
//         this.element.addEventListener("dragstart", this.handleDragStart)
//         this.element.addEventListener("dragend", this.handleDragEnd)
//     }
//     renderContent() {
//         this.element.querySelector("h2")!.textContent = this.project.title;
//         this.element.querySelector("h3")!.textContent = this.persons;
//         this.element.querySelector("p")!.textContent = this.project.description;
//     }
// }

// // project list class extending Component
// class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
//     assignedProjects: Project[];

//     constructor(private type: "active" | "finished") {
//         super("project-list", "app", false, `${type}-projects`)
//         this.assignedProjects = [];

//         this.configure()
//         this.renderContent();
//     }

//     @AutoBind
//     handleDragOver(event: DragEvent): void {
//         if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
//             event.preventDefault();
//             const listEl = this.element.querySelector('ul')!;
//             listEl.classList.add("droppable")
//         }
//     };

//     @AutoBind
//     handleDrop(event: DragEvent): void {
//         const projectId = +event.dataTransfer!.getData("text/plain");
//         projectState.moveProject(projectId, this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished);
//     };

//     @AutoBind
//     handleDragLeave(event: DragEvent): void {
//         const listEl = this.element.querySelector('ul')!;
//         listEl.classList.remove("droppable")
//     };

//     configure() {
//         this.element.addEventListener("dragover", this.handleDragOver);
//         this.element.addEventListener("dragleave", this.handleDragLeave);
//         this.element.addEventListener("drop", this.handleDrop);
//         // set up a listener
//         projectState.addListener((projects: Project[]) => {
//             const relevantProjects = projects.filter(p => {
//                 if (this.type === "active") {
//                     return p.status === ProjectStatus.Active;
//                 }
//                 return p.status === ProjectStatus.Finished;
//             })
//             this.assignedProjects = relevantProjects;
//             this.renderProjects();
//         })
//     };

//     renderContent() {
//         // assign an id to ul to reference later
//         const listId = `${this.type}-projects-list`;
//         this.element.querySelector("ul")!.id = listId;

//         // populate h2 element
//         this.element.querySelector("h2")!.textContent = this.type.toUpperCase() + " PROJECTS"
//     }

//     private renderProjects() {
//         const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
//         // reset content before every rerender
//         listEl.innerText = '';
//         for (const projectItem of this.assignedProjects) {
//             new ProjectItem(this.element.querySelector("ul")!.id, projectItem)
//         }
//     }

// }

// // project input class extending Component
// class ProjectInput extends Component<HTMLDivElement, HTMLElement> {
//     titleEl: HTMLInputElement;
//     descriptionEl: HTMLInputElement;
//     peopleEl: HTMLInputElement;

//     constructor() {
//         super("project-input", "app", true, "user-input")

//         // reach out the input elements
//         this.titleEl = this.element.querySelector("#title") as HTMLInputElement;
//         this.descriptionEl = this.element.querySelector("#description") as HTMLInputElement;
//         this.peopleEl = this.element.querySelector("#people") as HTMLInputElement;

//         // call the attach method to invoke right away
//         this.configure();
//     }

//     configure() {
//         this.element.addEventListener("submit", this.submitHandler)
//     }

//     renderContent(): void { }

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
//             projectState.addProject(title, description, people)

//             // clear user input fields
//             this.clearInputs();
//         }
//     }
// }

// const projectInput = new ProjectInput();
// const activeProjectList = new ProjectList("active");
// const finishedProjectList = new ProjectList("finished");