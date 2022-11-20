import {*} with "bi_enc.jac";
import {*} with "tfm_ner.jac";
node cai_state {
    has name;
    can init_wlk_ctx {
        new_wlk_ctx = {
            "intent": null,
            "entities": {"pairs" : [], "singles" : {"food" : [], "drink": [], "quantity": []}, "remove" : []},
            "prev_state": null,
            "next_state": null,
            "respond": false
        };
        if ("entities" in visitor.wlk_ctx) {
            // Carry over extracted entities from previous interaction
            new_wlk_ctx["entities"] = visitor.wlk_ctx["entities"];
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

    can extract_entities {
        res = tfm_ner.extract_entity(visitor.question);
        res_1, res_2 = tee(iterable)
        next(res_2, None)
        pair_res = zip(res_1, res_2)
        for ent1, ent2 in pair_res {
            ent_val_1 = ent1["entity_value"];
            ent_text_1 = ent1["entity_text"];
            ent_val_2 = ent2["entity_value"];
            ent_text_2 = ent2["entity_text"];
            
            if (ent_val_1 == "quantity" and (ent_val_2 == "food" or ent_val_2 == "drink")) {
                // append val and text to pairs list
                entity_pair_1 = (ent_val_1, ent_text_1)
                entity_pair_2 = (ent_val_2, ent_text_2)
                visitor.wlk_ctx["entities"]["pairs"].l::append((entity_pair_1, entity_pair_2));
            }
        }
        print("entities = ", visitor.wlk_ctx["entities"]["pairs"]) // DEBUG
    }

    can nlu {}
    can nlg {}
}

node dialogue_root:dialogue_state {
    has name = "dialogue_root";
    can nlu {
        ::classify_intent;
    }
    can process {
        visitor.wlk_ctx["respond"] = true;
        visitor.wlk_ctx["next_state"] = (-[intent_transition(intent==visitor.wlk_ctx["intent"])]->)[0];
    }
    can nlg {
        if (visitor.wlk_ctx["prev_state"].context["name"] == "confirmation") {
            visitor.response = "Sorry I got your meal wrong. Starting over from the beginning... \n \n Hi! How can I help you be healthy today?";
        } else {
            visitor.response = "Hi! How can I help you be healthy today?";
        }
    }
}

node record:dialogue_state {
    has name = "record";
    can nlu {
        if (!visitor.wlk_ctx["intent"]): ::classify_intent;
        ::extract_entities;
    }
    can process {
        required_entities = -[entity_transition]->.edge[0].context["entities"];
        // Check if we have any non-paired entities
        if (visitor.wlk_ctx["entities"]["singles"]) {
            visitor.recorded_food = true;
            visitor.wlk_ctx["next_state"] = -[entity_transition]->[0];
            visitor.wlk_ctx["prev_state"] = here;
        } else {
            visitor.wlk_ctx["respond"] = true;
            visitor.wlk_ctx["next_state"] = here;
        }
    }
    can nlg {
        response_string = "";
        for food in visitor.wlk_ctx["entities"]["singles"]["food"]:
            response_string += "How much " + food + " did you eat?\n";
        for drink in visitor.wlk_ctx["entities"]["singles"]["drink"]:
            response_string +=  "How much " + drink + " did you drink?\n";
        for quantity in visitor.wlk_ctx["entities"]["singles"]["quantity"]:
            response_string += "You had " + quantity + " of what again?\n";
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
        visitor.response = "Thank you! Do you have anything else you'd like to record?";
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
        visitor.response = "You had " + meal_string + ". Is that correct?";
    }
}

node meal_confirmed:dialogue_state{
    has name = "meal confirmed";
    can process {
        // record all data in database and update UI
        // response = request.post/get(url, data, headers)
    }
    can nlg {
        visitor.response = "Thank you! Your food and water intake have been updated. Have a healthy day!";
    }
}

node meal_canceled:dialogue_state{
    has name = "meal canceled";
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
        visitor.response = "How would you like to change your meal?"
    }
}

node remove:dialogue_state {
    has name = "remove";
    can extract_entities {
        res = tfm_ner.extract_entity(visitor.question);
        for ent in res {
            ent_type = ent["entity_value"];
            ent_text = ent["entity_text"];
            visitor.wlk_ctx["entities"]["remove"].l::append((ent_type, ent_text));
        }
    }
    can nlu {
        ::classify_intent;
        ::extract_entities;
    }
    can process {
        for ent in visitor.wlk_ctx["entities"]["remove"]:
            for pair in visitor.wlk_ctx["entities"]["pairs"]:
                if (pair[1][1] == ent): visitor.wlk_ctx["entities"]["pairs"].l::remove(pair)
        if (visitor.wlk_ctx["prev_state"]): visitor.wlk_ctx["respond"] = true;
        visitor.wlk_ctx["next_state"] = (-[intent_transition(intent==visitor.wlk_ctx["intent"])]->)[0];
        visitor.wlk_ctx["prev_state"] = here;
    }
    can nlg {
       visitor.response = "Removed! Anything you'd like to add to the meal?"
    }
}

edge entity_transition {
    has entities;
    has pairs;
}

edge intent_transition {
    has intent;
}

graph haigiea_graph {
    has anchor dialogue_root;
    spawn {
        dialogue_root = spawn node::dialogue_root;
        record_drink = spawn node::record_drink;
        record_food = spawn node::record_food;
        follow_up = spawn node::follow_up;
        confirmation = spawn node::confirmation;
        meal_confirmed = spawn node::meal_confirmed;
        meal_canceled = spawn node::meal_canceled;

        // OLD GRAPH
        // prompt user to say what they have eaten or drank today
        dialogue_root -[intent_transition(intent="record drink")]-> record_drink;
        dialogue_root -[intent_transition(intent="record food")]-> record_food;
        record_drink -[entity_transition(entities=["drink", "quantity_d"])]-> follow_up;
        record_drink -[intent_transition(intent="record drink or quantity_d")]-> record_drink;
        record_food -[entity_transition(entities=["food", "quantity_f"])]-> follow_up;
        record_food -[intent_transition(intent="record food or quantity_f")]-> record_food;
        follow_up -[intent_transition(intent="record drink")]-> record_drink;
        follow_up -[intent_transition(intent="record food")]-> record_food;
        follow_up -[intent_transition(intent="no")]-> confirmation;
        confirmation -[intent_transition(intent="yes")]-> meal_confirmed;
        confirmation -[intent_transition(intent="no")]-> dialogue_root; // maybe change_meal
        confirmation -[intent_transition(intent="cancel")]-> meal_canceled;

        // NEW GRAPH
        // prompt user to record meal
        dialogue_root --> record; 
        // if we have a pair of food/drink or both, go to follow up (Maybe self-loops here to get all entities)
        record -[entity_transition(entities["singles"]!=[])]-> follow_up;
        record -[entity_transition(entities["singles"]=[])]-> confirmation;
        record -[intent_transition(intent="record")]-> record;
        // ask if they have anything else to record
        follow_up -[intent_transition(intent="record")]-> record;
        follow_up -[intent_transition(intent="no")]-> confirmation;
        // repeat meal and ask if it is correct
        confirmation -[intent_transition(intent="yes")]-> meal_confirmed;
        confirmation -[intent_transition(intent="change meal")]-> change_meal;
        confirmation -[intent_transition(intent="cancel")]-> meal_canceled;
        // if they want to change meal, determine whether they want to add or remove an item
        change_meal -[intent_transition(intent="record")]-> record;
        change_meal -[intent_transition(intent="remove")]-> remove;
        // remove does as it says, then ask if they want to record anything more
        remove -[intent_transition(intent="record")]-> record;
        remove -[intent_transition(intent="no")]-> confirmation;
        
    }
}

walker talk {
    has question, interactive = true;
    has recorded_drink = false, recorded_food = false;
    has wlk_ctx = {
        "intent": null,
        "entities": {},
        "prev_state": null,
        "next_state": null,
        "respond": false
    };
    has response;
    root {
        take --> node::dialogue_root;
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
            take here;
        } else {
            take visitor.wlk_ctx["next_state"] else: take here;
        }
    }
}

walker init {
    root {
        spawn here --> graph::haigiea_graph;
        spawn here walker::talk;
    }
}