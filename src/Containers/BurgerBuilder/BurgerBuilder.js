import React, {Component} from 'react';
import {connect} from 'react-redux';


import Aux from '../../hoc/Aux/Aux';
import Burger from '../../Components/Burger/Burger';
import BuildControls from '../../Components/Burger/BuildControls/BuildControls';
import Modal from '../../Components/UI/Modal/Modal';
import OrderSummary from '../../Components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../Components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../Store/Actions/index';
import axios from '../../axios-orders';




export class BurgerBuilder extends Component{
    state = {
        purchasing: false,
    }

    componentDidMount () {
        this.props.onInitIngredients();
    }

    updatePurchaseState (ingredients){

        const sum = Object.keys(ingredients)
                .map(igKey => {
                    return ingredients[igKey];
                })
                .reduce((sum, el)=>{
                    return sum + el;
                }, 0);

            return sum > 0 ;
    }

    // addIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     const updatedCount = oldCount + 1;
    //     const  updatedIngredients = {
    //         ...this.state.ingredients };

    //     updatedIngredients[type] = updatedCount;

    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice =  oldPrice + priceAddition;

    //     this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
    //     this.updatePurchaseState(updatedIngredients);
    // };


    // removeIngredientHandler = (type) =>{
    //     const oldCount = this.state.ingredients[type];
    //     if (oldCount <= 0){
    //         return;
    //     }
    //     const updatedCount = oldCount - 1;
    //     const  updatedIngredients = {
    //         ...this.state.ingredients };

    //     updatedIngredients[type] = updatedCount;

    //     const priceDeduction = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice =  oldPrice - priceDeduction;

    //     this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
    //     this.updatePurchaseState(updatedIngredients);
    // }

    purchaseHandler = () => {
        if(this.props.isAthenticated){
            this.setState({purchasing: true});
        }else{
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
    }

    purchaseCancelHandler = () =>{
        this.setState({purchasing: false})
    }

    purchaseContinueHandler = () =>{
     this.props.onInitPurchase();
     this.props.history.push('/checkout');        
    }

    render(){
        const disabledInfo = {
            ...this.props.ings
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
       
       let orderSummary = null;
       let burger = this.props.error ? <p style={{textAlign: 'center'}}>Ingredients can't be loaded</p> : <Spinner />;
       
        if(this.props.ings){        
            
            burger = (
                <Aux>
                    <Burger ingredients = {this.props.ings}/>
                                <BuildControls 
                                    price={this.props.price}
                                    ingredientAdded={this.props.onIngredientAdded}
                                    ingredientRemove={this.props.onIngredientRemoved}
                                    disabled = {disabledInfo}
                                    purchasable={this.updatePurchaseState(this.props.ings)}
                                    ordered={this.purchaseHandler}
                                    isAuth= {this.props.isAthenticated}
                                    />
                                    
                </Aux>);
                
            orderSummary = <OrderSummary 
                ingredients = {this.props.ings}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                price={this.props.price}/>;
            }

        return (
        <Aux>
            <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
            {orderSummary}
            </Modal>
            {burger}
        </Aux>);
    }
}

const mapStateToProps = state => {
    return{
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAthenticated: state.auth.token !== null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));