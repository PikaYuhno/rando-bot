export default function (): string {
    const alphabet: string = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    const numbers: string = "0123456789";
    let id: string = "";
    for (let i = 0; i < 10; i++) {
        let rndNum: number = Math.floor(
            Math.random() * Math.floor(alphabet.length)
        );
        if (rndNum % 2 == 0) {
            id += alphabet[rndNum].toLowerCase();
        } else if (rndNum % 3 == 0) {
            id +=
                numbers[Math.floor(Math.random() * Math.floor(numbers.length))];
        } else {
            id += alphabet[rndNum].toUpperCase();
        }
    }
    return id;
}
