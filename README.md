# number-archer

Соответствие телефонных номеров и регионов РФ


## использование

> curl http://localhost:3101/number/:number

### Пример 

> curl http://localhost:3101/number/83912745000

### Результат 

`````javascript 
{
   "code":"391",
   "begin":"2745000",
   "end":"2745099",
   "capacity":"100",
   "operator":"qw",
   "region":{
      "code":"24",
      "title":"Кр.край",
      "county":"2"
   }
}
`````

Данные

https://github.com/antirek/numcap-regions