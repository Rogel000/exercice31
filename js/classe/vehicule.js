export default class Vehicule {
    constructor(brand, model, year) {
        this.brand = brand;
        this.model = model;
        this.kilometers = this.kilometers;
        this.year = year;
    }


display (){
    return ` ${this.brand} ${this.model} ${this.kilometers} km ${this.year}`
};

}