const path = '//mock.apifox.cn/m1/772752-0-default/cabinet/'
export const getCabinetByName = (name) => {
    return fetch(path + name).then((res) => res.json());
}
// export { getCabinetByName };
