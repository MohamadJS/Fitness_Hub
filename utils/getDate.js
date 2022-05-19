module.exports = function getDate(){
    let today = new Date();
    const dateMonth = (parseInt(today.getMonth()) + 1);
    today = today.getFullYear() + '-' + (today.getMonth() < 9 ? '0' + `${parseInt(today.getMonth()) + 1}` : `${parseInt(today.getMonth()) + 1}`) + '-' + (today.getDate() < 9 ? '0' + today.getDate() : today.getDate());
    let date = new Date(`${today}T00:00`);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    date = `${year}-${month}-${day}`;
    return date;
}