import { observable, autorun, toJS } from "mobx"

const version = "0.0"

function Init() {
  const v = localStorage.getItem("version")
  if (v !== version) {
    localStorage.clear()
    localStorage.setItem("version", version)
  }
}
Init()


const namelist: string[] = []

function addTolist(name: string) {
  if (namelist.indexOf(name) >= 0) console.warn("Duplicated local storage key: " + name)
  else namelist.push(name)
}

export function CreateLocalStore(name: string, defaultvalue = "") {
  addTolist(name)
  const s = localStorage.getItem(name) || defaultvalue
  return {
    value: s,
    save: (value: string) => localStorage.setItem(name, value)
  }
}

export function CreateAutoSaveObservableStore<T extends {}>(name: string, init: T) {
  addTolist(name)
  const s = localStorage.getItem(name)
  if (s) init = JSON.parse(s) as T
  const o = observable(init)
  autorun(() => localStorage.setItem(name, JSON.stringify(toJS(o))), { delay: 100 })
  return o
}


