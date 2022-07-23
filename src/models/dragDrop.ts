// create interfaces for drag/drop events
export interface Draggable {
    handleDragStart(event: DragEvent): void;
    handleDragEnd(event: DragEvent): void;
};

export interface DragTarget {
    handleDragOver(event: DragEvent): void;
    handleDrop(event: DragEvent): void;
    handleDragLeave(event: DragEvent): void;
}