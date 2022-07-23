// create an inheritable base Component class
export default abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateEl: HTMLTemplateElement;
    hostEl: T;
    element: U;

    constructor(templateId: string, hostElementId: string, insertAtStart: boolean, newElementId?: string) {
        // select the template to append
        this.templateEl = document.getElementById(templateId)! as HTMLTemplateElement;

        // select the host element to append the template
        this.hostEl = document.getElementById(hostElementId)! as T;

        // take a copy of the template content to be appended and extract the first element child
        const importedNode = document.importNode(this.templateEl.content, true);
        this.element = importedNode.firstElementChild as U;

        // add an id attribute to take advantage of pre-written css
        if (newElementId) {
            // this.element.id = `${this.type}-projects`;
            this.element.id = newElementId;
        }

        this.attach(insertAtStart);
    }

    private attach(insertAtBegin: boolean) {
        // insert the template element to the host element in the beginning
        this.hostEl.insertAdjacentElement(
            insertAtBegin ? "afterbegin" : "beforeend",
            this.element)
    }

    abstract configure(): void;
    abstract renderContent(): void;
}