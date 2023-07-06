class Filter {
  apply(image: any): any {
    return image;
  }
  static get type(): string {
    return "none";
  }
}

export default Filter;
