use std::cell::RefCell;
use candid::{CandidType, Nat};
use ic_cdk::{query, update};
use serde::Deserialize;


#[derive(CandidType,Deserialize,Clone)]
struct Todo{
    id : Nat,
    title : String,
    completed : bool
}

thread_local! {
    static TODOS: RefCell<Vec<Todo>> = RefCell::new(Vec::new());
}

#[update]
fn add_todo(title:String)-> Nat{
    TODOS.with(|todos| {
        let mut todos = todos.borrow_mut();
        let id = Nat::from((todos.len() as u64)+1);
        todos.push(Todo { id : id.clone(), title, completed: false });
        id
    })
}

#[query]
fn get_todos()-> Vec<Todo>{
    TODOS.with(|todos| todos.borrow().clone())
}

#[update]
fn toggle_todo(id:Nat)-> bool{
    TODOS.with(|todos| {
        let mut todos = todos.borrow_mut();
        if let Some(todo) = todos.iter_mut().find(|t| t.id == id){
            todo.completed = !todo.completed;
            return true;
        }
        false
    })
}

#[update]
fn delete_todo(id:Nat)->bool{
    TODOS.with(|todos| {
        let mut todos = todos.borrow_mut();
        let len_before = todos.len();
        todos.retain(|t| t.id != id);
        len_before!=todos.len()
    })
}