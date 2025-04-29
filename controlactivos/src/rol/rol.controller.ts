import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RolService } from './rol.service';
import { CreateRolDTO } from './dto/create-rol.dto';
import { UpdateRolDTO } from './dto/update-rol.dto';
import { Rol } from '@app/Entities/rol.entity';

@Controller('rol')
export class RolController {
    constructor(private rolService: RolService) { }

    @Post()
    createRol(@Body() createRolDTO : CreateRolDTO ): Promise<Rol>{
        return this.rolService.createRol(createRolDTO);
    }

    @Get()
    getAllRol(): Promise<Rol[]> {
        return this.rolService.getAllRoles();
    }

    @Get(':id')
    getRol(@Param('id') id : number){
        return this.rolService.getRol(id);
    }

    @Patch(':id')
    update(@Param('id') id : number, @Body() updateRolDTO : UpdateRolDTO){
        return this.rolService.updateRol(id, updateRolDTO);
    }

    @Delete(':id')
    deleteRol(@Param('id') id : number){
        return this.rolService.deleteRol(id);
    }
    //Hola
}
