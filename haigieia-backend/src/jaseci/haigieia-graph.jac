import {*} with "bi_enc.jac";
import {*} with "tfm_ner.jac";
node cai_state {
    has name;
    can init_wlk_ctx {
        new_wlk_ctx = {
            "intent": null,
            "entities": {"pairs" : [], "singles": [], "remove" : []},
            "prev_state": null,
            "next_state": null,
            "respond": false
        };
        if ("entities" in visitor.wlk_ctx) {
            // Carry over extracted entities from previous interaction
            new_wlk_ctx["entities"]["pairs"] = visitor.wlk_ctx["entities"]["pairs"];
            new_wlk_ctx["entities"]["remove"] = visitor.wlk_ctx["entities"]["remove"];
        }
        visitor.wlk_ctx = new_wlk_ctx;
    }
    can nlu {}
    can process {
        if (visitor.wlk_ctx["prev_state"]): visitor.wlk_ctx["respond"] = true;
        else {
            visitor.wlk_ctx["next_state"] = net.root();
            visitor.wlk_ctx["prev_state"] = here;
        }
    }
    can nlg {}
}

node dialogue_state:cai_state {
    can bi_enc.infer;
    can tfm_ner.extract_entity;

    can classify_intent {
        intent_labels = -[intent_transition]->.edge.intent;
        visitor.wlk_ctx["intent"] = bi_enc.infer(
            contexts = [visitor.question],
            candidates = intent_labels,
            context_type = "text",
            candidate_type = "text"
        )[0]["predicted"]["label"];
    }

    can extract_pairs {
        res = tfm_ner.extract_entity(visitor.question);
        limit = res.length - 1;
        for i = 0 to i < limit by i+=1 {
            ent_val_1 = res[i]["entity_value"];
            ent_text_1 = res[i]["entity_text"];
            ent_val_2 = res[i+1]["entity_value"];
            ent_text_2 = res[i+1]["entity_text"];
            
            if (ent_val_1 == "quantity" and (ent_val_2 == "food" or ent_val_2 == "drink")) {
                // append val and text to pairs list
                entity_pair_1 = [ent_val_1, ent_text_1];
                entity_pair_2 = [ent_val_2, ent_text_2];
                visitor.wlk_ctx["entities"]["pairs"].l::append([entity_pair_1, entity_pair_2]);
            }
        }
        std.out("pair entities = ", visitor.wlk_ctx["entities"]["pairs"]); // DEBUG
    }

    can extract_singles {
        res = tfm_ner.extract_entity(visitor.question);
        for ent in res {
            ent_val = ent["entity_value"];
            ent_text = ent["entity_text"];
            is_single = true;
            for pair in visitor.wlk_ctx["entities"]["pairs"]:
                if (ent_text == pair[0][1] or ent_text == pair[1][1]) {
                    is_single = false;
                }
            if (is_single) {
                visitor.wlk_ctx["entities"]["singles"].l::append([ent_val, ent_text]);
            }
        }
        std.out("single entities = ", visitor.wlk_ctx["entities"]["singles"]); // DEBUG
    }

    can nlu {}
    can nlg {}
}

node record:dialogue_state {
    has name = "record";
    can nlu {
        if (!visitor.wlk_ctx["intent"]): ::classify_intent;
        ::extract_pairs;
        ::extract_singles;
    }
    can process {
        // Check if we have any non-paired entities
        entity_singles = visitor.wlk_ctx["entities"]["singles"];
        std.out("Visitor single = ", visitor.single);
        std.out("Entity singles = ", entity_singles);
        if (entity_singles) {
            ent_edge = -[entity_transition]->.edge[0];
            if (visitor.wlk_ctx["intent"] == "record single") {
                if (visitor.single[0] == "quantity") {
                    visitor.wlk_ctx["entities"]["pairs"].l::append([visitor.single, entity_singles[0]]);
                } elif (entity_singles[0][0] == "quantity") {
                    visitor.wlk_ctx["entities"]["pairs"].l::append([entity_singles[0], visitor.single]);
                }
                ent_edge.singles = [];
            } else {
                visitor.wlk_ctx["respond"] = true;
                visitor.wlk_ctx["next_state"] = (-[intent_transition(intent==visitor.wlk_ctx["intent"])]->)[0];
                ent_edge.singles = entity_singles;
                visitor.wlk_ctx["prev_state"] = here;
            }
        }
        visitor.wlk_ctx["next_state"] = -[entity_transition]->[0];
        visitor.wlk_ctx["prev_state"] = here;
    }
    can nlg {
        response_string = "";
        for single in visitor.wlk_ctx["entities"]["singles"]:
            visitor.single = single;
            if single[0] == "food":
                response_string += "How much " + single[1] + " did you eat?\n";
            if single[0] == "drink":
                response_string +=  "How much " + single[1] + " did you drink?\n";
            if single[0] == "quantity":
                response_string += "You had " + single[1] + " of what again?\n";
        visitor.response = response_string;
    }
}

node follow_up:dialogue_state {
    has name = "follow_up";
    can nlu {
        ::classify_intent;
    }
    can process {
        if (visitor.wlk_ctx["prev_state"]): visitor.wlk_ctx["respond"] = true;
        visitor.wlk_ctx["next_state"] = (-[intent_transition(intent==visitor.wlk_ctx["intent"])]->)[0];
        visitor.wlk_ctx["prev_state"] = here;
    }
    can nlg {
        visitor.response = "Thank you! Would you like to record anything else? Please specify.";
    }
}

node confirmation:dialogue_state {
    has name = "confirmation";
    can nlu {
        ::classify_intent;
    }
    can process {
        if (visitor.wlk_ctx["prev_state"]): visitor.wlk_ctx["respond"] = true;
        visitor.wlk_ctx["next_state"] = (-[intent_transition(intent==visitor.wlk_ctx["intent"])]->)[0];
        visitor.wlk_ctx["prev_state"] = here;
    }
    can nlg {
        meal_string = "";
        for i = 0 to i < visitor.wlk_ctx["entities"]["pairs"].length by i+=1 {
            meal_string += visitor.wlk_ctx["entities"]["pairs"][i][0][1] + " " + visitor.wlk_ctx["entities"]["pairs"][i][1][1] + " and ";
        }
        visitor.response = "You had " + meal_string + "nothing else. Is that correct?";
    }
}

node meal_confirmed:dialogue_state{
    has name = "meal confirmed";
    has calories;
    has protein;
    has fat;
    has carbohydrates;
    can process {
        for ent in res {
            ent_val = ent["entity_value"];
            ent_text = ent["entity_text"];
            has food_url = "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=JZfAg8Eu8kWcNUca5PVTnvEyFjNJioCYNknNWdw9";
            has headers = {"Content-Type": "application/json"};
            has data = {"query": ent_text};
            nutrition_response = request.get(url ,data , headers);
            for nutrient in nutrition_response["foods"]["foodNutrients"]{
            
                if nutrient["name"] == "calories"{
                    calories = nutrient["amount"];
                }
                if nutrient["name"] == "protein"{
                    protein = nutrient["amount"];
                }
                if nutrient["name"] == "fat"{
                    fat = nutrient["amount"];
                }               
                if nutrient["name"] == "carbohydrates"{
                    carbohydrates = nutrient["amount"];
                }
                request.put("https://haigieia.firebaseapp.com/fireblog/users/bsteinig/userinfo.json", {"calories": calories, "protein": protein, "fat": fat, "carbs": carbohydrates}, {})
            } 


        }

        if (visitor.wlk_ctx["prev_state"]): visitor.wlk_ctx["respond"] = true;
    }
    can nlg {
        visitor.response = "Thank you! Your food and water intake have been updated. Have a healthy day!";
    }
}

node meal_canceled:dialogue_state{
    has name = "meal canceled";
    can process {
        if (visitor.wlk_ctx["prev_state"]): visitor.wlk_ctx["respond"] = true;
    }
    can nlg {
        visitor.response = "No worries! Your current meal recording session has been canceled.";
    }
}

node change_meal:dialogue_state {
    has name = "change meal";
    can nlu {
        ::classify_intent;
    }
    can process {
        if (visitor.wlk_ctx["prev_state"]): visitor.wlk_ctx["respond"] = true;
        visitor.wlk_ctx["next_state"] = (-[intent_transition(intent==visitor.wlk_ctx["intent"])]->)[0];
        visitor.wlk_ctx["prev_state"] = here;
    }
    can nlg {
        visitor.response = "How would you like to change your meal? Please respond with what you'd like to add or remove.";
    }
}

node remove:dialogue_state {
    has name = "remove";
    can extract_entities {
        res = tfm_ner.extract_entity(visitor.question);
        for ent in res {
            ent_val = ent["entity_value"];
            ent_text = ent["entity_text"];
            if (ent_val == "food" or ent_val == "drink") {
                visitor.wlk_ctx["entities"]["remove"].l::append([ent_val, ent_text]);
            }
        }
    }
    can nlu {
        ::classify_intent;
        ::extract_entities;
    }
    can process {
        for ent in visitor.wlk_ctx["entities"]["remove"]:
            pair_found = false;
            for pair in visitor.wlk_ctx["entities"]["pairs"]:
                if (pair[1][1] == ent[1]) {
                    visitor.wlk_ctx["entities"]["pairs"].l::remove(pair);
                    pair_found = true;
                }
            if (pair_found): visitor.wlk_ctx["entities"]["remove"].l::remove(ent);
        if (visitor.wlk_ctx["prev_state"]): visitor.wlk_ctx["respond"] = true;
        visitor.wlk_ctx["next_state"] = (-[intent_transition(intent==visitor.wlk_ctx["intent"])]->)[0];
        visitor.wlk_ctx["prev_state"] = here;
    }
    can nlg {
       visitor.response = "Removed! Anything else you'd like to add to or remove from the meal?";
    }
}

edge entity_transition {
    has entities;
    has singles;
}

edge intent_transition {
    has intent;
}

graph haigieia_graph {
    has anchor record;
    spawn {
        record = spawn node::record;
        follow_up = spawn node::follow_up;
        confirmation = spawn node::confirmation;
        meal_confirmed = spawn node::meal_confirmed;
        meal_canceled = spawn node::meal_canceled;
        change_meal = spawn node::change_meal;
        remove = spawn node::remove;

        // if we have a pair of food/drink or both, go to follow up (Maybe self-loops here to get all entities)
        record -[intent_transition(intent="record single")]-> record;
        record -[entity_transition(singles=[])]-> follow_up;
        record -[intent_transition(intent="record")]-> record;
        // ask if they have anything else to record
        follow_up -[intent_transition(intent="record")]-> record;
        follow_up -[intent_transition(intent="yes")]-> record;
        follow_up -[intent_transition(intent="no")]-> confirmation;
        // repeat meal and ask if it is correct
        confirmation -[intent_transition(intent="yes")]-> meal_confirmed;
        confirmation -[intent_transition(intent="change meal")]-> change_meal;
        confirmation -[intent_transition(intent="no")]-> change_meal;
        confirmation -[intent_transition(intent="remove")]-> change_meal;
        confirmation -[intent_transition(intent="cancel")]-> meal_canceled;
        // if they want to change meal, determine whether they want to add or remove an item
        change_meal -[intent_transition(intent="record")]-> record;
        change_meal -[intent_transition(intent="remove")]-> remove;
        // remove does as it says, then ask if they want to record anything more
        remove -[intent_transition(intent="record")]-> record;
        remove -[intent_transition(intent="remove")]-> remove;
        remove -[intent_transition(intent="no")]-> confirmation;
    }
}

walker talk {
    has question, interactive = true;
    has single;
    has wlk_ctx = {
        "intent": null,
        "entities": {"pairs" : [], "singles": [], "remove" : []},
        "prev_state": null,
        "next_state": null,
        "respond": false
    };
    has response;
    root {
        take --> node::record;
    }
    cai_state {
        if (!question and interactive) {
            question = std.input("Entry (Ctrl-C to exit)> "); // TODO: get input from STT module
            here::init_wlk_ctx;
        } elif (!question and !interactive){
            std.err("ERROR: question is required for non-interactive mode");
            disengage;
        }
        here::nlu;
        here::process;
        if (visitor.wlk_ctx["respond"]) {
            here::nlg;
            if (interactive): std.out(response);
            else {
                yield report response;
                here::init_wlk_ctx;
            }
            question = null;
            if (here.name == "meal confirmed" or here.name == "meal canceled") {
                disengage;
            }
            take here;
        } else {
            take visitor.wlk_ctx["next_state"] else: take here;
        }
    }
}

walker init {
    root {
        spawn here --> graph::haigieia_graph;
        spawn here walker::talk;
    }
}
